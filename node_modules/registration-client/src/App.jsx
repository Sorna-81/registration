import { useState } from 'react'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('')

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('Saving...')

    try {
      const response = await fetch('http://localhost:4000/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Failed to save registration')
      }

      setForm(initialForm)
      setStatus('Registration saved successfully!')
    } catch (error) {
      setStatus('Error saving registration. Please try again.')
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-semibold text-slate-900 mb-6">Registration Form</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">First Name</span>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="John"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Last Name</span>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="Doe"
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="john@example.com"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Phone</span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="(123) 456-7890"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Address</span>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              rows="4"
              placeholder="Street, City, State"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-sky-600 px-6 py-3 text-white font-semibold shadow-sm transition hover:bg-sky-700"
          >
            Submit Registration
          </button>
        </form>

        {status && <p className="mt-5 text-sm text-slate-700">{status}</p>}
      </div>
    </div>
  )
}

export default App
