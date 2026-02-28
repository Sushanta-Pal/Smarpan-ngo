import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isProduction = import.meta.env.PROD
const finalSupabaseUrl = isProduction ? `${window.location.origin}/supaproxy` : rawSupabaseUrl

// 3. Initialize Supabase with the safe routed URL
export const supabase = createClient(finalSupabaseUrl, supabaseAnonKey)

// ==========================================
// UTILITIES
// ==========================================

const convertGooglePhotosUrl = (url) => {
  if (!url || typeof url !== 'string') return url
  url = url.trim()
  if (url.includes('lh3.googleusercontent.com')) {
    const encoded = encodeURIComponent(url)
    return `https://images.weserv.nl/?url=${encoded}&w=1200&h=800&fit=cover`
  }
  return url
}

// Get absolute IST date from the database (Requires SQL RPC 'get_current_ist_date')
export const fetchCurrentDbDate = async () => {
  const { data, error } = await supabase.rpc('get_current_ist_date');
  if (error) throw error;
  return data; // Returns 'YYYY-MM-DD'
};


// ==========================================
// PUBLIC DATA FETCHING (Events, Team, Alumni)
// ==========================================

export const fetchEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    
    return (data || []).map(event => {
      let imageUrls = []
      if (event.imageUrls) {
        imageUrls = event.imageUrls
          .split(',')
          .map(url => url.trim())
          .filter(url => url && url.startsWith('http'))
          .map(url => convertGooglePhotosUrl(url))
      }
      return {
        ...event,
        event_date: event.date,
        description: event.contents,
        images: imageUrls,
        image_url: imageUrls.length > 0 ? imageUrls[0] : null
      }
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

export const fetchGalleryImages = async () => {
  try {
    let { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) throw error
    
    return (data || []).map(gallery => {
      const imageUrls = gallery.imageUrls 
        ? gallery.imageUrls
            .split(',')
            .map(url => url.trim())
            .filter(url => url && url.startsWith('http'))
            .map(url => convertGooglePhotosUrl(url))
        : []
      
      return {
        ...gallery,
        images: imageUrls,
        image_url: imageUrls.length > 0 ? imageUrls[0] : null,
        category: 'events'
      }
    })
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return []
  }
}

export const fetchTeamMembers = async () => {
  try {
    // Only fetch active members
    let { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('order_position', { ascending: true });

    if (error) throw error;

    return (data || []).map((row) => {
      let imageUrl = row.image_url || null;
      if (!imageUrl && row.image_path) {
        const cleanPath = row.image_path.replace(/^team-members\//, '');
        const { data: urlData } = supabase.storage
          .from('team-members')
          .getPublicUrl(cleanPath);
        imageUrl = urlData?.publicUrl;
      }
      return { ...row, image_url: imageUrl };
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
};

export const fetchAlumni = async () => {
  try {
    const { data, error } = await supabase
      .from('alumini')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) throw error
    
    return (data || []).map(alumnus => ({
      ...alumnus,
      name: alumnus.name,
      company_name: alumnus.company || 'Not specified',
      current_role: alumnus.company ? 'Professional' : 'Alumnus',
      graduation_year: alumnus.passout_batch ? parseInt(alumnus.passout_batch) : new Date().getFullYear(),
      image_url: alumnus.imageUrl ? convertGooglePhotosUrl(alumnus.imageUrl) : null,
      linkedin_url: alumnus.linkedinUrl,
      achievement: `Working at ${alumnus.company || 'community'}`,
      success_story: `${alumnus.name} is a valued member of our alumni network.`
    }))
  } catch (error) {
    console.error('Error fetching alumni:', error)
    return []
  }
}

export const fetchFeaturedAlumni = async () => {
  try {
    const { data, error } = await supabase
      .from('alumini')
      .select('*')
      .eq('is_featured', true)
      .order('graduation_year', { ascending: false })
      .limit(6)
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching featured alumni:', error)
    return []
  }
}


// ==========================================
// STORAGE & GENERIC UPLOADS
// ==========================================

export const uploadImage = async (bucket, file, path) => {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file)
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { success: false, error: error.message }
  }
}

export const deleteImage = async (bucket, path) => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting image:', error)
    return { success: false, error: error.message }
  }
}

export const getImageUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data?.publicUrl || ''
}


// ==========================================
// ROUTINE & VOLUNTEER MANAGEMENT
// ==========================================

export const fetchDailyRoutine = async (date) => {
  const { data, error } = await supabase
    .from('routine_instances')
    .select(`
      id,
      actual_date,
      location,
      attendance_status,
      status,
      assigned_volunteer_id,
      assigned_user:volunteers_registry!assigned_volunteer_id(name, position, whatsapp_number) 
    `)
    .eq('actual_date', date)
    .order('location', { ascending: true });

  if (error) {
    console.error("Error fetching routine:", error);
    return [];
  }
  return data;
};

export const markAttendance = async (instanceId, status, volunteerId) => {
  const { error: instanceError } = await supabase
    .from('routine_instances')
    .update({ 
      attendance_status: status,
      check_in_time: status === 'present' ? new Date().toISOString() : null
    })
    .eq('id', instanceId);

  if (instanceError) throw instanceError;

  if (status === 'present' && volunteerId) {
    const { data: vol } = await supabase
      .from('volunteers_registry')
      .select('total_attendance')
      .eq('id', volunteerId)
      .single();

    if (vol) {
      await supabase
        .from('volunteers_registry')
        .update({ total_attendance: vol.total_attendance + 1 })
        .eq('id', volunteerId);
    }
  }
  return true;
};

export const requestSwap = async (instanceId, requesterId) => {
  const { error: updateError } = await supabase
    .from('routine_instances')
    .update({ status: 'swap_requested' })
    .eq('id', instanceId);
  
  if (updateError) throw updateError; 

  const { data, error } = await supabase
    .from('swap_requests')
    .insert([{ instance_id: instanceId, requester_id: requesterId, status: 'open' }]);

  if (error) throw error;
  return data;
};

export const fetchOpenSwaps = async () => {
  const { data, error } = await supabase
    .from('swap_requests')
    .select(`
      id,
      status,
      requester:volunteers_registry!requester_id(name, position),
      instance:routine_instances!instance_id(id, actual_date, location)
    `)
    .eq('status', 'open');

  if (error) {
    console.error("Error fetching swaps:", error);
    return [];
  }
  return data;
};

export const acceptSwapRequest = async (swapRequestId, instanceId, newUserId) => {
  const { error: instanceError } = await supabase
    .from('routine_instances')
    .update({ 
      assigned_volunteer_id: newUserId, 
      status: 'scheduled' 
    })
    .eq('id', instanceId);

  if (instanceError) throw instanceError;

  const { error: swapError } = await supabase
    .from('swap_requests')
    .update({ 
      status: 'completed', 
      new_assigned_id: newUserId 
    })
    .eq('id', swapRequestId);

  if (swapError) throw swapError;

  return true;
};

// ==========================================
// MISC
// ==========================================

export const submitContactForm = async (formData) => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([formData])
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return { success: false, error: error.message }
  }
}