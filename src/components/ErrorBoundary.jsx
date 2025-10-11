import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // you could log to an external service here
    console.error('ErrorBoundary caught', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl rounded bg-white p-6 shadow">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">{String(this.state.error)}</pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
