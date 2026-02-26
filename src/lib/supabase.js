import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to convert Google Photos URLs and use a CORS proxy
const convertGooglePhotosUrl = (url) => {
  if (!url || typeof url !== 'string') return url
  
  url = url.trim()
  
  // Google Photos URLs need CORS proxy to work in browsers
  // Using weserv.nl which is a reliable image proxy with CORS support
  if (url.includes('lh3.googleusercontent.com')) {
    // Encode the URL and use weserv.nl image proxy
    const encoded = encodeURIComponent(url)
    return `https://images.weserv.nl/?url=${encoded}&w=1200&h=800&fit=cover`
  }
  
  return url
}

export const fetchEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    
    // Transform the data to match component expectations
    return (data || []).map(event => {
      let imageUrls = []
      
      if (event.imageUrls) {
        // Split by comma and filter out empty strings
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
    
    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('[fetchGalleryImages] Table does not exist. Create it or insert mock data.')
        return []
      }
      throw error
    }
    
    // Transform the data to match component expectations
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
    // 1. Try fetching active members first
    let { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('order_position', { ascending: true });

    // 2. Fallback: If no active members found, fetch everything without filters
    if (error || !data || data.length === 0) {
      console.warn('[fetchTeamMembers] No active members, fetching all rows...');
      const fallback = await supabase
        .from('team_members')
        .select('*')
        .order('order_position', { ascending: true });
      
      data = fallback.data;
      if (fallback.error) throw fallback.error;
    }

    // 3. Map URLs - Fix path duplication issue
    return (data || []).map((row) => {
      let imageUrl = row.image_url || null;
      if (!imageUrl && row.image_path) {
        // Remove 'team-members/' prefix if it exists to avoid duplication
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
    return []; // Return empty so the UI doesn't crash
  }
};
export const fetchAlumni = async () => {
  try {
    const { data, error } = await supabase
      .from('alumini')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) throw error
    
    // Transform the data to match component expectations
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

export const uploadTeamImage = async (file, memberId) => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${memberId}-${Date.now()}.${fileExt}`
    const filePath = `team-members/${fileName}`

    const { data, error } = await supabase.storage
      .from('team-members')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('team-members')
      .getPublicUrl(filePath)

    return { success: true, path: filePath, url: urlData.publicUrl }
  } catch (error) {
    console.error('Error uploading team image:', error)
    return { success: false, error: error.message }
  }
}

export const uploadAlumniImage = async (file, alumniId) => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${alumniId}-${Date.now()}.${fileExt}`
    const filePath = `alumni/${fileName}`

    const { data, error } = await supabase.storage
      .from('alumni')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('alumni')
      .getPublicUrl(filePath)

    return { success: true, path: filePath, url: urlData.publicUrl }
  } catch (error) {
    console.error('Error uploading alumni image:', error)
    return { success: false, error: error.message }
  }
}

export const deleteTeamImage = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('team-members')
      .remove([filePath])
    
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting team image:', error)
    return { success: false, error: error.message }
  }
}

export const deleteAlumniImage = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('alumni')
      .remove([filePath])
    
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting alumni image:', error)
    return { success: false, error: error.message }
  }
}

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

export const uploadImage = async (bucket, file, path) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { success: false, error: error.message }
  }
}

export const getImageUrl = (bucket, path) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data?.publicUrl || ''
}
