<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Booking Management</h1>
        <p class="text-gray-600 mt-2">View and manage your hotel bookings</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Search/Filter Bar -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search by Guest</label>
            <input
              v-model="filters.guestName"
              type="text"
              placeholder="Guest name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input
              v-model="filters.dateFrom"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex items-end">
            <button
              @click="fetchBookings"
              :disabled="loading"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ loading ? 'Loading...' : 'Search' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <!-- Bookings List -->
      <div v-if="bookings.length > 0" class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ filteredBookings.length }} Booking{{ filteredBookings.length !== 1 ? 's' : '' }}
          </h2>
          <div class="flex space-x-2">
            <button
              @click="exportBookings"
              class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotel
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="booking in filteredBookings" :key="booking.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ booking.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ booking.guestName }}</div>
                    <div class="text-sm text-gray-500">{{ booking.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ booking.hotelName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}
                    <div class="text-xs text-gray-500">{{ booking.nights }} night{{ booking.nights !== 1 ? 's' : '' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${{ booking.totalPrice }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(booking.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
                      {{ booking.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        @click="viewBooking(booking)"
                        class="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button
                        v-if="booking.status === 'confirmed'"
                        @click="cancelBooking(booking)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">📋</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
        <p class="text-gray-600">There are no bookings matching your criteria.</p>
      </div>
    </div>

    <!-- Booking Detail Modal -->
    <div
      v-if="showBookingModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Booking Details</h3>
          <button
            @click="showBookingModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div v-if="selectedBooking" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Booking ID</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedBooking.id }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <span :class="getStatusClass(selectedBooking.status)" class="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full">
                {{ selectedBooking.status }}
              </span>
            </div>
          </div>

          <div class="border-t pt-4">
            <h4 class="font-medium text-gray-900 mb-2">Guest Information</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedBooking.guestName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedBooking.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Phone</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedBooking.phone }}</p>
              </div>
            </div>
          </div>

          <div class="border-t pt-4">
            <h4 class="font-medium text-gray-900 mb-2">Booking Details</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Hotel</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedBooking.hotelName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Check-in</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedBooking.checkIn) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Check-out</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedBooking.checkOut) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nights</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedBooking.nights }}</p>
              </div>
            </div>
          </div>

          <div class="border-t pt-4">
            <h4 class="font-medium text-gray-900 mb-2">Payment Information</h4>
            <div class="bg-gray-50 p-3 rounded">
              <p class="text-lg font-semibold text-gray-900">Total: ${{ selectedBooking.totalPrice }}</p>
              <p class="text-sm text-gray-600">Created: {{ formatDateTime(selectedBooking.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'BookingManagement',
  setup() {
    const bookings = ref([])
    const loading = ref(false)
    const error = ref('')
    const showBookingModal = ref(false)
    const selectedBooking = ref(null)

    const filters = ref({
      guestName: '',
      status: '',
      dateFrom: ''
    })

    const filteredBookings = computed(() => {
      return bookings.value.filter(booking => {
        const matchesGuest = !filters.value.guestName || 
          booking.guestName.toLowerCase().includes(filters.value.guestName.toLowerCase())
        
        const matchesStatus = !filters.value.status || booking.status === filters.value.status
        
        const matchesDate = !filters.value.dateFrom || 
          new Date(booking.checkIn) >= new Date(filters.value.dateFrom)

        return matchesGuest && matchesStatus && matchesDate
      })
    })

    const fetchBookings = async () => {
      loading.value = true
      error.value = ''

      try {
        const response = await fetch('/api/bookings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch bookings')
        }

        const data = await response.json()
        bookings.value = data.bookings || []
      } catch (err) {
        error.value = err.message || 'An error occurred while fetching bookings'
        console.error('Fetch bookings error:', err)
      } finally {
        loading.value = false
      }
    }

    const viewBooking = (booking) => {
      selectedBooking.value = booking
      showBookingModal.value = true
    }

    const cancelBooking = async (booking) => {
      if (!confirm(`Are you sure you want to cancel booking ${booking.id}?`)) {
        return
      }

      try {
        const response = await fetch(`/api/bookings/${booking.id}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (!response.ok) {
          throw new Error('Failed to cancel booking')
        }

        // Update the booking status locally
        const index = bookings.value.findIndex(b => b.id === booking.id)
        if (index !== -1) {
          bookings.value[index].status = 'cancelled'
        }

        alert('Booking cancelled successfully')
      } catch (err) {
        error.value = err.message || 'An error occurred while cancelling the booking'
        console.error('Cancel booking error:', err)
      }
    }

    const exportBookings = () => {
      const csvContent = [
        ['Booking ID', 'Guest Name', 'Email', 'Phone', 'Hotel', 'Check-in', 'Check-out', 'Nights', 'Total Price', 'Status', 'Created At'].join(','),
        ...filteredBookings.value.map(booking => [
          booking.id,
          booking.guestName,
          booking.email,
          booking.phone,
          booking.hotelName,
          booking.checkIn,
          booking.checkOut,
          booking.nights,
          booking.totalPrice,
          booking.status,
          booking.createdAt
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    }

    const getStatusClass = (status) => {
      const classes = {
        confirmed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        cancelled: 'bg-red-100 text-red-800',
        completed: 'bg-blue-100 text-blue-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const formatDateTime = (dateString) => {
      return new Date(dateString).toLocaleString()
    }

    onMounted(() => {
      fetchBookings()
    })

    return {
      bookings,
      filteredBookings,
      loading,
      error,
      showBookingModal,
      selectedBooking,
      filters,
      fetchBookings,
      viewBooking,
      cancelBooking,
      exportBookings,
      getStatusClass,
      formatDate,
      formatDateTime
    }
  }
}
</script>
