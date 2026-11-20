// checks the checkout form. returns an object like { phone: 'message' }
// with one entry per field that is wrong. empty object = form is fine.

const NAME_PATTERN = /^[A-Za-z][A-Za-z .']+$/
// pakistani mobile: 03XX-XXXXXXX (dash optional)
const PHONE_PATTERN = /^03\d{2}-?\d{7}$/

export function validateCheckout(form, area) {
  const errors = {}
  const name = form.fullName.trim()
  const phone = form.phone.trim()
  const address = form.address.trim()

  if (name === '') {
    errors.fullName = 'Please enter your name.'
  } else if (name.length < 3 || !NAME_PATTERN.test(name)) {
    errors.fullName = 'Name should be at least 3 letters (letters, spaces, . and \' only).'
  }

  if (phone === '') {
    errors.phone = 'Please enter a mobile number so we can confirm the order.'
  } else if (!PHONE_PATTERN.test(phone)) {
    errors.phone = 'Use a Pakistani mobile number like 0312-3456789.'
  }

  if (form.method === 'delivery') {
    if (!form.areaId) {
      errors.areaId = 'Choose your delivery area.'
    } else if (area && !area.served) {
      errors.areaId = "We don't deliver to that area yet. Switch to pickup from the shop."
    }

    if (address === '') {
      errors.address = 'Please enter your delivery address.'
    } else if (address.length < 10) {
      errors.address = 'Address looks too short. Add house / hostel name, street and sector.'
    }
  } else if (form.method === 'pickup') {
    if (!form.pickupDay) {
      errors.pickupDay = 'Choose a day to collect your order.'
    }
  } else {
    errors.method = 'Choose delivery or pickup.'
  }

  return errors
}

// next 5 days the shop is open (closed on Sunday)
export function getPickupDays(fromDate = new Date()) {
  const days = []
  const date = new Date(fromDate)
  while (days.length < 5) {
    date.setDate(date.getDate() + 1)
    if (date.getDay() !== 0) {
      // build yyyy-mm-dd from local time (toISOString uses UTC and can be a day off in Pakistan)
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      days.push({
        value: `${date.getFullYear()}-${month}-${day}`,
        label: date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      })
    }
  }
  return days
}
