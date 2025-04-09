"use client"

import Link from "next/link"

export default function Home(){
  return(
    <>
    <main className="min-h-screen w-full text-foreground bg-background flex justify-center items-center flex-col space-y-3">
      <h1 className="text-4xl">Hello <span className="text-orange-500 poppins">Reddit!</span></h1>
      <h3>This is the start of the development process of KawAikoLink!</h3>
      <Link className="underline hover:text-orange-500 transition-colors" href="https://github.com/shijisan/KawAikoLink">Github Repo</Link>
      <img className="w-32 aspect-square rounded-md" src="cooltolfo.jpg" alt="cooltolfo" />

    </main>
    </>
  )
}