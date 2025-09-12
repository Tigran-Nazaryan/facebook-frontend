"use client";

import {Main} from "@/components/layout/main";

export function Footer() {
  return (
    <footer className="w-full border-t py-6 bg-gray-50 text-center text-sm text-gray-600">
      <Main>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-semibold">MyApp</div>

          <nav className="flex gap-4">
            <a href="/about" className="hover:underline">About</a>
            <a href="/contact" className="hover:underline">Contact</a>
            <a href="/blog" className="hover:underline">Blog</a>
          </nav>

          <div className="flex gap-3">
            <a href="https://github.com/" target="_blank">GitHub</a>
            <a href="https://linkedin.com/" target="_blank">LinkedIn</a>
          </div>
        </div>
      </Main>
    </footer>
  );
}
