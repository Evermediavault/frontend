'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative bg-[#09050C] py-16 px-4 mt-auto">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-12">
          {/* Contact Form - Left Side */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-8">
              <Image
                src="/images/logo.png"
                alt="EVERMEDIA VAULT"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <h2 className="text-white font-bold text-lg tracking-wider">
                EVERMEDIA VAULT
              </h2>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name');
                const email = formData.get('email');
                const message = formData.get('message');

                if (!name || !email || !message) {
                  alert('Please fill in all fields');
                  return;
                }

                if (confirm('Are you sure you want to submit this form?')) {
                  alert(
                    'Thank you for contacting us! We will get back to you soon.',
                  );
                  e.currentTarget.reset();
                }
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="footer-name"
                    className="block text-[#A6A6A6] text-sm mb-2"
                  >
                    Your name
                  </label>
                  <input
                    type="text"
                    id="footer-name"
                    name="name"
                    required
                    className="w-full px-4 py-2 bg-transparent border border-gray-700 rounded focus:border-gray-500 focus:outline-none transition-colors text-white text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="footer-email"
                    className="block text-[#A6A6A6] text-sm mb-2"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    id="footer-email"
                    name="email"
                    required
                    className="w-full px-4 py-2 bg-transparent border border-gray-700 rounded focus:border-gray-500 focus:outline-none transition-colors text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="footer-message"
                  className="block text-[#A6A6A6] text-sm mb-2"
                >
                  message
                </label>
                <textarea
                  id="footer-message"
                  name="message"
                  rows={3}
                  required
                  className="w-full px-4 py-2 bg-transparent border border-gray-700 rounded focus:border-gray-500 focus:outline-none transition-colors text-white text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="btn-ripple px-8 py-2 bg-gradient-to-r from-[#0A4DD3] to-[#06BAD9] hover:from-[#0A4DD3] hover:to-[#08D0F0] text-white text-base font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Links - Right Side */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">
                social media
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-[#C8C8C8] hover:text-white transition-colors text-sm"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#C8C8C8] hover:text-white transition-colors text-sm"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#C8C8C8] hover:text-white transition-colors text-sm"
                  >
                    Medium
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">
                contact us
              </h3>
              <ul className="space-y-3">
                <li>
                  <span className="text-[#C8C8C8] text-sm">email us</span>
                </li>
                <li>
                  <a
                    href="mailto:business@123.com"
                    className="text-[#C8C8C8] hover:text-white transition-colors text-sm underline"
                  >
                    business@123.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">
                Support
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-[#C8C8C8] hover:text-white transition-colors text-sm"
                  >
                    Help center
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="">
          <p className="text-white text-xs text-center">
            © 2023 evermedia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
