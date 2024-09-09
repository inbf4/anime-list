'use client'

import { useState, useMemo } from 'react'
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
  const [search, setSearch] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('Watching')

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

  const filteredAnimeList = useMemo(() => {
    if (!animeList) return null
    if (!search) return animeList

    const filtered: AnimeList = Object.entries(animeList).reduce((acc, [status, animes]) => {
      acc[status as Status] = animes.filter(anime => anime.name.toLowerCase().includes(search.toLowerCase()))
      return acc
    }, {} as AnimeList)

    return filtered
  }, [animeList, search])

  const allAnimes = useMemo(() => {
    if (!filteredAnimeList) return []
    return Object.values(filteredAnimeList).flat()
  }, [filteredAnimeList])

  const currentTabAnimes = useMemo(() => {
    if (!filteredAnimeList || activeTab === 'All') return allAnimes
    return filteredAnimeList[activeTab as Status] || []
  }, [filteredAnimeList, activeTab, allAnimes])

  const effectiveTab = currentTabAnimes.length === 0 && search ? 'All' : activeTab

  return (
    <div className='min-h-screen p-4 sm:p-12'>
      <div className='max-w-screen-xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Aniwave List</h1>
        <div className='mb-8'>
          <Label htmlFor='json-file'>Upload your JSON file</Label>
          <Input id='json-file' type='file' onChange={handleFileUpload} accept='.json' />
        </div>
        {animeList && (
          <Tabs value={effectiveTab} onValueChange={setActiveTab}>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className='sm:max-w-xs'
                placeholder='Search'
              />
              <TabsList className='h-auto flex-col sm:h-10 sm:flex-row mb-4'>
                <TabsTrigger
                  value='All'
                  className='w-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                >
                  All
                </TabsTrigger>
                {Object.keys(animeList).map(status => (
                  <TabsTrigger
                    key={status}
                    value={status}
                    className='w-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                  >
                    {status}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <h2 className='text-2xl font-semibold mb-4'>
              {effectiveTab === 'All'
                ? `All Animes (${allAnimes.length})`
                : `${effectiveTab} (${currentTabAnimes.length})`}
            </h2>
            <TabsContent value='All'>
              <div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                {allAnimes.map((anime, index) => (
                  <AnimeCard key={index} anime={anime} />
                ))}
              </div>
            </TabsContent>
            {Object.entries(filteredAnimeList || {}).map(([status, animes]) => (
              <TabsContent key={status} value={status}>
                <div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                  {animes.map((anime, index) => (
                    <AnimeCard key={index} anime={anime} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  )
}

function AnimeCard({ anime }: { anime: AnimeEntry }) {
  return (
    <Card>
      <CardContent className='flex flex-col justify-between h-full p-4'>
        {anime.name}
        <div className='flex gap-4'>
          <a href={anime.mal} target='_blank' rel='noopener noreferrer' className='text-blue-500 hover:underline'>
            MAL
          </a>
          <a href={anime.al} target='_blank' rel='noopener noreferrer' className='text-blue-500 hover:underline'>
            AL
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
