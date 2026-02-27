import { useState, useEffect } from 'react'
import { fetchEvents, fetchGalleryImages, fetchTeamMembers, fetchAlumni } from './supabase'

export const useEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents()
        setEvents(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  return { events, loading, error }
}

export const useGallery = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadImages = async () => {
      try {
        const data = await fetchGalleryImages()
        setImages(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [])

  return { images, loading, error }
}

export const useTeamMembers = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadMembers = async () => {
      try {
        console.log('[useTeamMembers] Hook loading...')
        const startTime = performance.now()
        
        const data = await fetchTeamMembers()
        
        const endTime = performance.now()
        const duration = (endTime - startTime).toFixed(2)
        
        if (isMounted) {
          setMembers(data)
          
          if (data.length === 0) {
            console.warn('[useTeamMembers] No team members found from Supabase')
            setError(null) // Don't show error for timeout - just use fallback silently
          } else {
            console.log('[useTeamMembers] ✓ Got', data.length, 'members in', duration, 'ms')
            setError(null)
          }
        }
      } catch (err) {
        console.error('[useTeamMembers] Error:', err.message || err)
        if (isMounted) {
          // Don't show error UI for timeout - just use fallback silently
          setError(null)
          setMembers([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMembers()

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false
    }
  }, [])

  return { members, loading, error }
}

export const useAlumni = () => {
  const [alumni, setAlumni] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAlumni = async () => {
      try {
        const data = await fetchAlumni()
        setAlumni(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadAlumni()
  }, [])

  return { alumni, loading, error }
}
// Fetch all open swap requests for the Marketplace
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

// Accept a shift from the Marketplace
export const acceptSwapRequest = async (swapRequestId, instanceId, newUserId) => {
  // 1. Update the actual routine instance with the new volunteer's ID
  const { error: instanceError } = await supabase
    .from('routine_instances')
    .update({ 
      assigned_volunteer_id: newUserId, 
      status: 'scheduled' 
    })
    .eq('id', instanceId);

  if (instanceError) throw instanceError;

  // 2. Mark the swap request as completed
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