"use client"

import { ChevronLeft, Loader2, Search } from 'lucide-react'
import * as React from 'react'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { NavBar } from './(components)/nav-bar'
import FilePreview from './(components)/FilePreview'
import { AnalysisResult, SimilarComplaint } from '@/lib/types'
import { SimilarComplaintsResponse } from '../api/similar-complaints/route'
import { useUser } from '@clerk/nextjs'

export const summarizeSchema = z.object({
  transcript: z.string().min(10),
})
type FormData = z.infer<typeof summarizeSchema>

export default function SummarizePage() {
  const { user, isLoaded } = useUser();

  const form = useForm<FormData>({
    resolver: zodResolver(summarizeSchema),
    defaultValues: {
      transcript: '',
    },
  })

  const [isTextInput, setIsTextInput] = React.useState<boolean>(true)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [analysis, setAnalysis] = React.useState<AnalysisResult[] | null>(null)
  const [numberComplaints, setNumberComplaints] = React.useState<number>(0)
  const [file, setFile] = React.useState<any>();
  const [similarComplaints, setSimilarComplaints] = React.useState<SimilarComplaint[] | null>(null)
  const [isLoadingSimilarComplaints, setIsLoadingSimilarComplaints] = React.useState<boolean>(false)
  const [transcript, setTranscript] = React.useState<string>('The service was terrible. I would not recommend it to anyone.')

  async function onSubmit(_data: FormData) {
    setIsLoading(true)

    // Create formData object
    const formData = new FormData();
    if (isTextInput) {
      formData.append('transcript', _data.transcript);
    } else if (file) {
      formData.append('file', file);
    }

    const res: Response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    });

    setIsLoading(false)
    if (!res.ok) {
      return toast.error('Something went wrong.', {
        description: 'Your request failed. Please try again.',
      })
    }
    const data: any = await res.json()

    setAnalysis(data.analysis);
    getnumberComplaints(data.analysis);

    // saveComplaints(data); // TODO: Uncomment this line to save complaints to the database

  }

  const saveComplaints = async (data: any) => {
    if (!isLoaded || !user) {
      return toast.error('User not loaded or logged in.');
    }

    const responseData = {
      userId: user.id, 
      transcript: data.transcript,
      fileUrl: data.fileUrl ? data.fileUrl : null,
      analysis: data.analysis,
    };

    console.log(responseData);

    const res = await fetch('/api/savedata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responseData),
    });

    if (!res.ok) {
      toast.error('Failed to save complaints');
    }
  };

  const getnumberComplaints = (array: AnalysisResult[]) => {
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    event.target.value = '';
  }

  const findSimilarComplaints = async (transcript: string) => {
    try {
      setIsLoadingSimilarComplaints(true)
      const response = await fetch('/api/similar-complaints', {
        method: 'POST',
        body: JSON.stringify({ transcriptSummary: transcript }),
      })

      if (!response.ok) {
        throw new Error('Failed to find similar complaints')
      }

      const data: SimilarComplaintsResponse = await response.json()
      setSimilarComplaints(data.similarComplaints)
    } catch (error) {
      console.error('Error finding similar complaints:', error)
      toast.error('Error', {
        description: 'Something went wrong. Please try again.',
      })
    }
    setIsLoadingSimilarComplaints(false)
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
          {isTextInput ? (
            <div className="grid gap-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="transcript"
                      render={({ field }) => (
                        <FormItem>
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
                    <button type="submit" className={cn(buttonVariants())} disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                      Submit
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-12 h-12 mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="mb-2 text-lg text-gray-500">
                      <strong>Click to upload</strong> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">Images, audio and video files. (MAX. 10MB)</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              {file ? <FilePreview file={file} removeFile={() => setFile(null)} /> : null}
              <div className="flex w-full">
                <button className={cn(buttonVariants(), 'w-full')} disabled={isLoading || !file}
                  onClick={() => {
                    setFile(null);
                    onSubmit({ transcript: '' });
                  }}>
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
          <div>
            {transcript && (
              <Button
                variant='outline'
                className='w-full'
                disabled={isLoadingSimilarComplaints}
                onClick={() => findSimilarComplaints(transcript)}
              >
                <Search className='mr-2 size-4' />
                Find similar complaints
              </Button>
            )}
          </div>
          <div className='pb-4'>
            <div>
              {isLoadingSimilarComplaints && (
                <div className="flex flex-row items-center mt-2 p-4 border rounded-md shadow-sm bg-[var(--color-three)]">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  <span>Finding similar complaints...</span>
                </div>
              )}
            </div>
            <div>
              {similarComplaints && similarComplaints.length === 0 && (
                <div className="mt-2 p-4 border rounded-md shadow-sm bg-[var(--color-three)]">
                  <span>No similar complaints found.</span>
                </div>
              )}
            </div>
            <div>
              {similarComplaints && similarComplaints.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold">Similar Complaints</h2>
                  <div className="mt-3 p-4 border rounded-md shadow-sm bg-[var(--color-three)]">
                    {similarComplaints.map((complaint, index) => (
                      <div key={index} className="mt-2">
                        <p className="text-sm"><strong>Summary:</strong> {complaint.complaintSummary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
