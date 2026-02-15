import Link from 'next/link';
import { Linkedin, Mail, Phone, Twitter } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";

const quickLinks = [
  { href: '/jobs', label: 'Jobs' },
  { href: '/companies', label: 'Companies' },
  { href: '/students', label: 'Students' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const resources = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms & Conditions' },
  { href: '/help-support', label: 'Help / Support' },
  { href: '/faq', label: 'FAQ' },
];

export function SiteFooter(): React.ReactElement {
  return (
    <footer className='border-t bg-background'>
      <div className='container pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8 grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <p className='text-sm font-semibold'>Vasantrao Naik Mahavidyalaya</p>
          </div>
          <p className='text-sm text-muted-foreground'>
            A centralized placement operations platform for daily academic-industry recruitment workflows.
          </p>
          <p className='text-sm text-muted-foreground'>
            Mission: transparent, fair, and outcome-driven placement process.
          </p>
        </div>

        <div className='space-y-4'>
          <h3 className='text-sm font-semibold'>Quick Links</h3>
          <ul className='space-y-2 text-sm text-muted-foreground'>
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className='transition-colors hover:text-foreground'>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className='space-y-4'>
          <h3 className='text-sm font-semibold'>Resources</h3>
          <ul className='space-y-2 text-sm text-muted-foreground'>
            {resources.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className='transition-colors hover:text-foreground'>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className='space-y-4'>
          <h3 className='text-sm font-semibold'>Contact</h3>
          <div className='space-y-2 text-sm text-muted-foreground'>
            <p>Vasantrao Naik Mahavidyalaya</p>
            <p>Airport Road</p>
            <p>Cidco Aurangabad</p>
            <p>Maharashtra - 431001</p>
            <p>India</p>
            <p className='flex items-center gap-2'>
              <Mail className='h-4 w-4' /> placement@naikcollege.org
            </p>
            <p className='flex items-center gap-2'>
              <Phone className='h-4 w-4' /> +91 02565 223045
            </p>
          </div>

          <div className='flex items-center gap-2 text-muted-foreground'>
            <Link
              href='#'
              target='_blank'
              className='rounded-md border p-2 transition-all hover:scale-105'
            >
              <Linkedin className='h-4 w-4 text-[#0A66C2]' />
            </Link>

            <Link
              href='mailto:placement@naikcollege.org'
              className='rounded-md border p-2 transition-all hover:scale-105'
            >
              <Mail className='h-4 w-4 text-[#EA4335]' />
            </Link>
            <Link
              href='#'
              target='_blank'
              className='rounded-md border p-2 transition-all hover:scale-105'
            >
              <Twitter className='h-4 w-4 text-[#1DA1F2]' />
            </Link>



            {/* ✅ WhatsApp Icon Added */}
            <Link
              href="https://wa.me/917843054577?text=Hello%20Vasantrao%20Naik%20Mahavidyalaya%20Placement%20Team,%20I%20am%20contacting%20regarding%20college%20placement%20process."
              target="_blank"
              className='rounded-md border p-2 transition-colors hover:bg-accent'
            >
              <FaWhatsapp className='h-4 w-4 text-green-600' />
            </Link>

          </div>
        </div>
      </div>

      <div className='border-t'>
        <div className='container pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8 flex flex-col items-center justify-between gap-2 py-4 text-sm text-muted-foreground sm:flex-row'>
          <p>© {new Date().getFullYear()} College Placement Management Portal</p>
          <p>Built for daily TPO, student, and recruiter operations</p>
        </div>
      </div>
    </footer>
  );
}
