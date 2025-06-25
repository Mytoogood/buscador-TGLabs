<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-blue-600 text-white py-16">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl font-bold mb-4">Find Your Perfect Hotel</h1>
        <p class="text-xl opacity-90">Search and book hotels worldwide with Moblix</p>
      </div>
    </div>

    <!-- Search Form -->
    <div class="max-w-4xl mx-auto px-4 -mt-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <form @submit.prevent="searchHotels" class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input
              v-model="searchForm.destination"
              type="text"
              placeholder="City, hotel, or landmark"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
            <input
              v-model="searchForm.checkIn"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
            <input
              v-model="searchForm.checkOut"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex items-end">
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ loading ? 'Searching...' : 'Search Hotels' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Results -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <div v-if="hotels.length > 0" class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-900">Available Hotels</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="hotel in hotels"
            :key="hotel.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              :src="hotel.image || '/placeholder-hotel.jpg'"
              :alt="hotel.name"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ hotel.name }}</h3>
              <p class="text-gray-600 mb-2">{{ hotel.location }}</p>
              <div class="flex items-center mb-2">
                <div class="flex text-yellow-400">
                  <span v-for="i in 5" :key="i" class="text-sm">
                    {{ i <= hotel.rating ? '★' : '☆' }}
                  </span>
                </div>
                <span class="ml-2 text-sm text-gray-600">({{ hotel.reviews }} reviews)</span>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-2xl font-bold text-blue-600">${{ hotel.price }}</span>
                  <span class="text-gray-600">/night</span>
                </div>
                <button
                  @click="bookHotel(hotel)"
                  class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!loading && searchPerformed" class="text-center py-8">
        <p class="text-gray-600">No hotels found. Try adjusting your search criteria.</p>
      </div>
    </div>

    <!-- Booking Modal -->
    <div
      v-if="showBookingModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Book {{ selectedHotel?.name }}</h3>
        <form @submit.prevent="confirmBooking" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
            <input
              v-model="bookingForm.guestName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="bookingForm.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              v-model="bookingForm.phone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="bg-gray-50 p-3 rounded">
            <p class="text-sm text-gray-600">
              Total: ${{ selectedHotel?.price }} × {{ nights }} nights = 
              <span class="font-semibold">${{ totalPrice }}</span>
            </p>
          </div>
          <div class="flex space-x-3">
            <button
              type="button"
              @click="showBookingModal = false"
              class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="bookingLoading"
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {{ bookingLoading ? 'Booking...' : 'Confirm Booking' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'HotelSearch',
  setup() {
    const searchForm = ref({
      destination: '',
      checkIn: '',
      checkOut: ''
    })

    const bookingForm = ref({
      guestName: '',
      email: '',
      phone: ''
    })

    const hotels = ref([])
    const loading = ref(false)
    const bookingLoading = ref(false)
    const error = ref('')
    const searchPerformed = ref(false)
    const showBookingModal = ref(false)
    const selectedHotel = ref(null)

    const nights = computed(() => {
      if (!searchForm.value.checkIn || !searchForm.value.checkOut) return 1
      const checkIn = new Date(searchForm.value.checkIn)
      const checkOut = new Date(searchForm.value.checkOut)
      const diffTime = Math.abs(checkOut - checkIn)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
    })

    const totalPrice = computed(() => {
      return selectedHotel.value ? selectedHotel.value.price * nights.value : 0
    })

    const searchHotels = async () => {
      if (!searchForm.value.destination || !searchForm.value.checkIn || !searchForm.value.checkOut) {
        error.value = 'Please fill in all search fields'
        return
      }

      loading.value = true
      error.value = ''
      searchPerformed.value = true

      try {
        const response = await fetch('/api/hotels/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            destination: searchForm.value.destination,
            checkIn: searchForm.value.checkIn,
            checkOut: searchForm.value.checkOut
          })
        })

        if (!response.ok) {
          throw new Error('Failed to search hotels')
        }

        const data = await response.json()
        hotels.value = data.hotels || []
      } catch (err) {
        error.value = err.message || 'An error occurred while searching for hotels'
        console.error('Hotel search error:', err)
      } finally {
        loading.value = false
      }
    }

    const bookHotel = (hotel) => {
      selectedHotel.value = hotel
      showBookingModal.value = true
    }

    const confirmBooking = async () => {
      bookingLoading.value = true
      
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            hotelId: selectedHotel.value.id,
            hotelName: selectedHotel.value.name,
            checkIn: searchForm.value.checkIn,
            checkOut: searchForm.value.checkOut,
            guestName: bookingForm.value.guestName,
            email: bookingForm.value.email,
            phone: bookingForm.value.phone,
            totalPrice: totalPrice.value,
            nights: nights.value
          })
        })

        if (!response.ok) {
          throw new Error('Failed to create booking')
        }

        const data = await response.json()
        alert(`Booking confirmed! Booking ID: ${data.bookingId}`)
        showBookingModal.value = false
        
        // Reset form
        bookingForm.value = {
          guestName: '',
          email: '',
          phone: ''
        }
      } catch (err) {
        error.value = err.message || 'An error occurred while booking'
        console.error('Booking error:', err)
      } finally {
        bookingLoading.value = false
      }
    }

    // Set default dates
    onMounted(() => {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      searchForm.value.checkIn = today.toISOString().split('T')[0]
      searchForm.value.checkOut = tomorrow.toISOString().split('T')[0]
    })

    return {
      searchForm,
      bookingForm,
      hotels,
      loading,
      bookingLoading,
      error,
      searchPerformed,
      showBookingModal,
      selectedHotel,
      nights,
      totalPrice,
      searchHotels,
      bookHotel,
      confirmBooking
    }
  }
}
</script>
