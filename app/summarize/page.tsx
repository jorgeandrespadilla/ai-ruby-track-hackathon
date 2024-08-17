"use client"

import { ChevronLeft, Loader2 } from 'lucide-react'
import type { Metadata } from 'next'
import * as React from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'


export const summarizeSchema = z.object({
  transcript: z.string().min(10),
})
type FormData = z.infer<typeof summarizeSchema>

interface ResponseData {
  isComplaint: boolean;
  summary: string | null;
}

export default function SummarizePage() {
  const form = useForm<FormData>({
    resolver: zodResolver(summarizeSchema),
    defaultValues: {
      transcript: '',
    },
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [analysis, setAnalysis] =  React.useState<ResponseData | null>(null)

  async function onSubmit(_data: FormData) {
    setIsLoading(true)
    const res = await fetch('api/summarize', {
      method: 'POST',
      body: JSON.stringify(_data),
    })

    setIsLoading(false)
    if (!res.ok) {
      return toast.error('Something went wrong.', {
        description: 'Your request failed. Please try again.',
      })
    }
    const data:ResponseData = await res.json()
    setAnalysis(data)

  }

  return (
    <div>
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute left-4 top-4 md:left-8 md:top-8',
          )}
        >
          <>
            <ChevronLeft className="mr-2 size-4" />
            Back
          </>
        </Link>
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <div className="flex flex-col gap-2 text-center">
            {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
            <h1 className="text-2xl font-semibold tracking-tight">
              Complaint Analyzer
            </h1>
            <p className="text-muted-foreground text-sm">Enter your Complaint</p>
          </div>
          <div className='grid gap-6'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="transcript"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel>Email</FormLabel> */}
                        <FormControl>
                          <Textarea
                            rows={10}
                            id="transcript"
                            placeholder="write your complaints"
                            autoCorrect="on"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <button
                    type="submit"
                    className={cn(buttonVariants())}
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Submit
                  </button>
                </div>
              </form>
            </Form>
          </div>
          <div>
            {analysis && (
              <div className="mt-6 p-4 border rounded-md shadow-sm bg-blue-950 mb-6">
                <h2 className="text-lg font-semibold ">Analysis Result</h2>
                <p className="text-sm"><strong>Summary:</strong> {analysis.summary || 'This was not a complaint'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
