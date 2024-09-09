'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface AnimeEntry {
  name: string
  mal: string
  al: string
}

type Status = 'Planned' | 'Dropped' | 'On-Hold' | 'Watched' | 'Watching'

type AnimeList = Record<Status, AnimeEntry[]>

export default function Home() {
  const [animeList, setAnimeList] = useState<AnimeList | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        try {
          const json = JSON.parse(e.target?.result as string)
          setAnimeList(json)
        } catch (error) {
          console.error('Error parsing JSON:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className='min-h-screen p-4 sm:p-12'>
      <div className='max-w-screen-xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Aniwave List</h1>
        <div className='mb-8'>
          <Label htmlFor='json-file'>Upload your JSON file</Label>
          <Input id='json-file' type='file' onChange={handleFileUpload} accept='.json' />
        </div>
        {animeList && (
          <Tabs defaultValue='Watching'>
            <TabsList className='mb-4'>
              {Object.keys(animeList).map((status) => (
                <TabsTrigger key={status} value={status}>
                  {status}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(animeList).map(([status, animes]) => (
              <TabsContent key={status} value={status}>
                <Card>
                  <CardContent className='pt-6'>
                    <ul className='list-disc pl-5'>
                      {animes.map((anime, index) => (
                        <li key={index} className='mb-2'>
                          <a
                            href={anime.mal}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-500 hover:underline'
                          >
                            {anime.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  )
}
