export interface ShortUrl {
	created: Date
	isPublic: boolean
	shortUrl: string,
	description: string|null
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
