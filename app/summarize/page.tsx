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
import { NavBar } from './(components)/nav-bar'
import FilePreview from './(components)/FilePreview'

export const summarizeSchema = z.object({
  transcript: z.string().min(10),
})
type FormData = z.infer<typeof summarizeSchema>

interface ResponseData {
  isComplaint: boolean;
  summary: string | null;
  product: string | null;
  sub_product: string | null;
  rating: string | null;
  company: string | null;
}

export default function SummarizePage() {
  const form = useForm<FormData>({
    resolver: zodResolver(summarizeSchema),
    defaultValues: {
      transcript: '',
    },
  })

  const [isTextInput, setIsTextInput] = React.useState<boolean>(true)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [analysis, setAnalysis] = React.useState<ResponseData[] | null>(null)
  const [numberComplaints, setNumberComplaints] = React.useState<number>(0)
  const [file, setFile] = React.useState<any>();

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
    const data: any = await res.json()
    setAnalysis(data.result)
    getnumberComplaints(data.result);

  }

  const getnumberComplaints = (array: ResponseData[]) => {
    let count = 0;
    array?.map((item) => {
      if (item.isComplaint) {
        count++;
      }
    });
    setNumberComplaints(count);
  }

  const onFileSelect = (file: any) => {
    if (file && file.size > 10000000) {
      return toast.error('Error', {
        description: 'Maximum file upload size is 10MB.',
      })
    }
    setFile(file);
  }

  //Storing the file
  const uploadFile = (file: any) => {

  }

  return (
    <div>
      <div className="container flex w-screen flex-col items-center justify-center">

        <header className="absolute top-4 left-0 w-full flex items-center justify-between px-4 md:px-8">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'flex items-center space-x-2 hidden md:flex'
            )}
          >
            <ChevronLeft className="size-4" />
            <span>Back</span>
          </Link>


          <div className="absolute left-1/2 transform -translate-x-1/2 ">
            <NavBar />
          </div>
        </header>

        <div className="mx-auto mt-40 flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <div className="flex flex-col gap-2 text-center">
            {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
            <h1 className="text-2xl font-semibold tracking-tight">
              Complaint Analyzer
            </h1>
            <p className="text-muted-foreground text-sm mb-3">Select your files for analysis</p>
            <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2">
              <div>
                <button
                  className={`block w-full cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-300 hover:text-black 
                    ${isTextInput ? 'bg-white text-black' : null
                    }`}
                  onClick={() => setIsTextInput(true)}
                >
                  <span className="text-sm">Text Input</span>
                </button>
              </div>

              <div>
                <button
                  className={`block w-full cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-300 hover:text-black 
                    ${!isTextInput ? 'bg-white text-black' : null
                    }`}
                  onClick={() => setIsTextInput(false)}
                >
                  <span className="text-sm">File Upload</span>
                </button>
              </div>
            </div>

          </div>
          {isTextInput ?
            (<div className='grid gap-6'>
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
                              placeholder="Paste all your reviews here"
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
            </div>)
            : (
              <div className='grid gap-4'>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-blue-100 dark:border-gray-600 dark:hover:border-gray-500">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-12 h-12 mb-4 text-blue-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      <p className="mb-2 text-lg md:text-xl text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          <strong>Click to upload</strong></span> or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Images, audio and video files. (MAX. 10MB)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={(event) => {
                      const file = event?.target?.files?.[0];
                      if (file) {
                        onFileSelect(file);
                      }
                    }} />
                  </label>
                </div>

                {file ? <FilePreview file={file} removeFile={() => setFile(null)} /> : null}
                <div className="flex w-full">
                  <button
                    className={cn(buttonVariants(), 'w-full')}
                    disabled={isLoading || !file}
                    onClick={() => { uploadFile(file); setFile(null); }}
                  >
                    {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Upload
                  </button>
                </div>
              </div>
            )}
          <div>
            {analysis && (
              <div>
                <h2 className="text-lg font-semibold">Analysis Result</h2>
                <div className="mt-3 p-4 border rounded-md shadow-sm bg-[var(--color-three)]">
                  <p className="text-sm">
                    Out of {analysis.length} reviews, {numberComplaints} are complaints.
                    {numberComplaints === 0 ? ' Great job!' : null}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div>
            {analysis && analysis.map((item, index) => {
              if (item.isComplaint) {
                return (
                  <div key={index}>
                    <div className="mt-6 p-4 border rounded-md shadow-sm bg-blue-950 mb-6">
                      <p className="text-sm"><strong>Company:</strong> {item.company || 'No company mentioned'}</p>
                      <p className="text-sm"><strong>Product:</strong> {item.product}</p>
                      <p className="text-sm"><strong>Product category:</strong> {item.sub_product || 'No sub-product found.'}</p>
                      <p className="text-sm"><strong>Rating:</strong> {item.rating || 'No rating specified'}</p>
                      <p className="text-sm"><strong>Summary:</strong> {item.summary}</p>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
