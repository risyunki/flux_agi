"use client"

import { User, Mail, Key, ChevronRight } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-stone-900">Profile</h1>
          <p className="text-stone-600 mt-1">Manage your account settings</p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="group relative overflow-hidden rounded-[2rem] backdrop-blur-[2px] bg-white/40 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-100/20 via-stone-100/10 to-stone-100/20" />
          <div className="relative space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-2xl bg-stone-800 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">F</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-stone-900">John Doe</h2>
                <p className="text-stone-600">Administrator</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-stone-200/30 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        <div className="group relative overflow-hidden rounded-[2rem] backdrop-blur-[2px] bg-white/40 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-100/20 via-stone-100/10 to-stone-100/20" />
          <div className="relative space-y-6">
            <h3 className="text-xl font-semibold text-stone-900">Account Details</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-stone-600" />
                  <div>
                    <h4 className="font-medium text-stone-900">Full Name</h4>
                    <p className="text-sm text-stone-600">John Doe</p>
                  </div>
                </div>
                <button className="group relative inline-flex items-center text-sm font-medium text-stone-900">
                  <span className="relative">
                    Edit
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-stone-900 transition-all duration-300 group-hover:w-full" />
                  </span>
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-stone-600" />
                  <div>
                    <h4 className="font-medium text-stone-900">Email</h4>
                    <p className="text-sm text-stone-600">john.doe@example.com</p>
                  </div>
                </div>
                <button className="group relative inline-flex items-center text-sm font-medium text-stone-900">
                  <span className="relative">
                    Edit
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-stone-900 transition-all duration-300 group-hover:w-full" />
                  </span>
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-stone-600" />
                  <div>
                    <h4 className="font-medium text-stone-900">Password</h4>
                    <p className="text-sm text-stone-600">Last changed 2 months ago</p>
                  </div>
                </div>
                <button className="group relative inline-flex items-center text-sm font-medium text-stone-900">
                  <span className="relative">
                    Change
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-stone-900 transition-all duration-300 group-hover:w-full" />
                  </span>
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-stone-200/30 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </div>
    </div>
  )
} 