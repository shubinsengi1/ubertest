import React from 'react';
import { Link } from 'react-router-dom';
import { Car, MapPin, Shield, Clock, Star, Users } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="navbar px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-uber-black" />
            <span className="text-2xl font-bold text-uber-black">UberClone</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-uber-black to-uber-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Go anywhere with
                <span className="text-uber-yellow"> UberClone</span>
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                Request a ride, hop in, and go. Choose from multiple ride options
                and get where you're going safely and efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register?type=user" className="btn-primary">
                  Ride with us
                </Link>
                <Link to="/register?type=driver" className="btn-secondary">
                  Drive & Earn
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-8">
                <h3 className="text-xl font-semibold mb-6">Get a ride now</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-uber-green" />
                    <input
                      type="text"
                      placeholder="Pickup location"
                      className="flex-1 bg-transparent outline-none"
                    />
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-uber-orange" />
                    <input
                      type="text"
                      placeholder="Drop-off location"
                      className="flex-1 bg-transparent outline-none"
                    />
                  </div>
                  <button className="w-full btn-primary">
                    Request UberClone
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-uber-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-uber-black mb-4">
              Why choose UberClone?
            </h2>
            <p className="text-xl text-gray-600">
              Safe, reliable, and convenient transportation at your fingertips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="h-8 w-8 text-uber-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safety First</h3>
              <p className="text-gray-600">
                All drivers are verified and vehicles are inspected for your safety
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="h-8 w-8 text-uber-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Always Available</h3>
              <p className="text-gray-600">
                24/7 service with drivers available whenever you need them
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="h-8 w-8 text-uber-yellow" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Top Rated</h3>
              <p className="text-gray-600">
                Highly rated drivers providing excellent service every time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Driver Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-uber-black mb-6">
                Drive when you want, make what you need
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Make money on your schedule with deliveries or rides—or both.
                You can use your own car or choose a rental through UberClone.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-uber-green rounded-full w-6 h-6 flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Set your own hours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-uber-green rounded-full w-6 h-6 flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Keep 100% of your tips</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-uber-green rounded-full w-6 h-6 flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Get paid weekly</span>
                </div>
              </div>
              <Link to="/register?type=driver" className="btn-primary">
                Start driving today
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-uber-green to-uber-blue rounded-lg p-8 text-white">
                <div className="flex items-center space-x-4 mb-6">
                  <Users className="h-12 w-12" />
                  <div>
                    <div className="text-3xl font-bold">$2,000+</div>
                    <div className="text-lg">Average monthly earnings</div>
                  </div>
                </div>
                <p className="text-lg opacity-90">
                  Join thousands of drivers earning flexible income on their own schedule
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-uber-black text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-6 w-6" />
                <span className="text-xl font-bold">UberClone</span>
              </div>
              <p className="text-gray-400">
                Reliable transportation and delivery services at your fingertips.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Safety</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 UberClone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;