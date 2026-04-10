'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import ContactFeedbackModal from './ContactFeedbackModal';
import { submitContact } from '../../lib/request';

type FeedbackState = {
  open: boolean;
  variant: 'success' | 'error';
  title?: string;
  message: string;
};

const initialFeedback: FeedbackState = {
  open: false,
  variant: 'success',
  message: '',
};

function trim(s: FormDataEntryValue | null): string {
  if (s == null) return '';
  return String(s).trim();
}

export default function Footer() {
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(initialFeedback);

  const closeFeedback = useCallback(() => {
    setFeedback((f) => ({ ...f, open: false }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const user_name = trim(fd.get('user_name'));
    const email = trim(fd.get('email'));
    const content = trim(fd.get('content'));

    if (!user_name || !email || !content) {
      setFeedback({
        open: true,
        variant: 'error',
        title: 'Missing fields',
        message: 'Please fill in all fields.',
      });
      return;
    }
    if (user_name.length > 15) {
      setFeedback({
        open: true,
        variant: 'error',
        title: 'Invalid name',
        message: 'Name must be at most 15 characters.',
      });
      return;
    }
    if (content.length > 1024) {
      setFeedback({
        open: true,
        variant: 'error',
        title: 'Message too long',
        message: 'Message must be at most 1024 characters.',
      });
      return;
    }

    setSubmitting(true);
    try {
      await submitContact({ user_name, email, content });
      form.reset();
      setFeedback({
        open: true,
        variant: 'success',
        title: 'Thank you',
        message:
          'Your message has been sent. We will get back to you as soon as possible.',
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again later.';
      setFeedback({
        open: true,
        variant: 'error',
        title: 'Could not send',
        message: msg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-[#09050C] py-16 px-4 mt-auto">
      <ContactFeedbackModal
        open={feedback.open}
        variant={feedback.variant}
        title={feedback.title}
        message={feedback.message}
        onClose={closeFeedback}
      />

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

            <form className="space-y-4" onSubmit={handleSubmit}>
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
                    name="user_name"
                    required
                    maxLength={15}
                    autoComplete="name"
                    disabled={submitting}
                    className="w-full px-4 py-2 bg-transparent border border-gray-700 rounded focus:border-gray-500 focus:outline-none transition-colors text-white text-sm disabled:opacity-50"
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
                    maxLength={255}
                    autoComplete="email"
                    disabled={submitting}
                    className="w-full px-4 py-2 bg-transparent border border-gray-700 rounded focus:border-gray-500 focus:outline-none transition-colors text-white text-sm disabled:opacity-50"
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
                  name="content"
                  rows={3}
                  required
                  maxLength={1024}
                  disabled={submitting}
                  className="w-full px-4 py-2 bg-transparent border border-gray-700 rounded focus:border-gray-500 focus:outline-none transition-colors text-white text-sm resize-none disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="btn-ripple px-8 py-2 bg-gradient-to-r from-[#0A4DD3] to-[#06BAD9] hover:from-[#0A4DD3] hover:to-[#08D0F0] text-white text-base font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending…' : 'Submit'}
              </button>
            </form>
          </div>

          {/* Links - Right Side */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">
                Social Media
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://x.com/EvermediaV"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C8C8C8] hover:text-white transition-colors text-sm"
                  >
                    X
                  </a>
                </li>
                <li>
                  <a
                    href="https://medium.com/@evermediavault"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C8C8C8] hover:text-white transition-colors text-sm"
                  >
                    Medium
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:contact@evermediav.com"
                    className="text-[#C8C8C8] hover:text-white transition-colors text-sm underline"
                  >
                    contact@evermediav.com
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
