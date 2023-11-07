export interface ShortUrl {
	created: Date
	isPublic: boolean
	shortUrl: string
}

export interface UrlHistory {
	shortUrl?: ShortUrl
	longUrls: LongUrl[]
}

export interface LongUrl {
	longUrl: string
	created: Date
	versionTag: string
}
