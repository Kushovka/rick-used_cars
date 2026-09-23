import { useCallback, useEffect, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaExpand, FaSearchPlus, FaTimes } from 'react-icons/fa'
import { listVehicleImages } from '../api/vehicles'

type VehicleGalleryProps = {
  images: string[]
  imagesTotal?: number
  slug: string
  title: string
}

const swipeThreshold = 48
const loadBatchSize = 8
const thumbnailWindowSize = 5

export const VehicleGallery = ({ images, imagesTotal, slug, title }: VehicleGalleryProps) => {
  const [active, setActive] = useState(0)
  const [loadedImages, setLoadedImages] = useState(images)
  const [totalImages, setTotalImages] = useState(imagesTotal || images.length)
  const [imageLoading, setImageLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [waitingForMorePhotos, setWaitingForMorePhotos] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const [expandedThumbnails, setExpandedThumbnails] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [thumbnailWindowStart, setThumbnailWindowStart] = useState(0)
  const [readyThumbnails, setReadyThumbnails] = useState<Set<string>>(() => new Set())

  const hasManyImages = totalImages > 1
  const currentImage = loadedImages[active] ?? loadedImages[loadedImages.length - 1] ?? loadedImages[0]
  const previewWindowStart = Math.min(thumbnailWindowStart, Math.max(0, loadedImages.length - 1))
  const previewImages = loadedImages.slice(previewWindowStart, previewWindowStart + thumbnailWindowSize)
  const waitingAtLoadedEdge = loadingMore && active >= loadedImages.length - 2 && loadedImages.length < totalImages
  const navigationLocked = imageLoading || waitingForMorePhotos || waitingAtLoadedEdge

  useEffect(() => {
    setActive(0)
    setLoadedImages(images)
    setTotalImages(imagesTotal || images.length)
    setImageLoading(false)
    setLoadingMore(false)
    setWaitingForMorePhotos(false)
    setReadyThumbnails(new Set(images))
    setZoomed(false)
    setExpandedThumbnails(false)
    setThumbnailWindowStart(0)
  }, [images, imagesTotal, slug])

  const markThumbnailReady = (image: string) => {
    setReadyThumbnails((current) => {
      if (current.has(image)) return current

      const next = new Set(current)
      next.add(image)
      return next
    })
  }

  const loadMoreImages = useCallback(async (targetIndex?: number, revealBatch = false) => {
    if (loadingMore || loadedImages.length >= totalImages) return
    if (typeof targetIndex === 'number' && targetIndex < loadedImages.length - 2) return

    const batchStart = loadedImages.length
    setLoadingMore(true)
    try {
      const response = await listVehicleImages(slug, loadedImages.length, loadBatchSize)
      const seen = new Set(loadedImages)
      const nextImages = response.items.filter((image) => !seen.has(image))
      const mergedImages = [...loadedImages, ...nextImages]
      setLoadedImages(mergedImages)
      setTotalImages(response.total)
      if (revealBatch && nextImages.length > 0) {
        setThumbnailWindowStart(batchStart)
      }
      // A prefetch can finish after its target image is already on screen. In
      // that case the browser will not fire a second img `load` event, so do
      // not restart the per-photo loader. Only switch/loading-state for an
      // image that arrived in this newly fetched batch.
      if (typeof targetIndex === 'number' && targetIndex >= batchStart && targetIndex < mergedImages.length) {
        setImageLoading(true)
        setActive(targetIndex)
        setThumbnailWindowStart(Math.floor(targetIndex / thumbnailWindowSize) * thumbnailWindowSize)
        setZoomed(false)
      }
    } finally {
      if (typeof targetIndex !== 'number') {
        setImageLoading(false)
      }
      setWaitingForMorePhotos(false)
      setLoadingMore(false)
    }
  }, [loadedImages, loadingMore, slug, totalImages])

  const expandThumbnails = useCallback(() => {
    setExpandedThumbnails(true)
    void loadMoreImages()
  }, [loadMoreImages])

  useEffect(() => {
    const nextImage = loadedImages[active + 1]
    if (!nextImage) return

    const image = new Image()
    image.src = nextImage
  }, [active, loadedImages])

  useEffect(() => {
    previewImages.forEach((source) => {
      if (readyThumbnails.has(source)) return

      const image = new Image()
      image.onload = () => markThumbnailReady(source)
      image.onerror = () => markThumbnailReady(source)
      image.src = source
    })
  }, [previewImages, readyThumbnails])

  const goTo = useCallback((index: number) => {
    if (!loadedImages.length || navigationLocked) return

    const nextIndex = index < 0
      ? totalImages - 1
      : index >= totalImages
        ? 0
        : index
    if (nextIndex === active) {
      setImageLoading(false)
      return
    }

    if (nextIndex >= loadedImages.length) {
      setImageLoading(false)
      setWaitingForMorePhotos(true)
      void loadMoreImages(nextIndex)
      return
    }

    setImageLoading(true)
    setActive(nextIndex)
    setThumbnailWindowStart(Math.floor(nextIndex / thumbnailWindowSize) * thumbnailWindowSize)
    setZoomed(false)

    if (nextIndex >= loadedImages.length - 2) {
      void loadMoreImages(nextIndex)
    }
  }, [active, loadMoreImages, loadedImages.length, navigationLocked, totalImages])

  const previous = useCallback(() => goTo(active - 1), [active, goTo])
  const next = useCallback(() => goTo(active + 1), [active, goTo])

  const selectAndOpenImage = (index: number) => {
    if (navigationLocked) return

    goTo(index)
    setLightbox(true)
  }

  const handlePointerDown = (clientX: number) => {
    setTouchStart(clientX)
  }

  const handlePointerUp = (clientX: number) => {
    if (touchStart === null || !hasManyImages) return

    const delta = clientX - touchStart
    if (Math.abs(delta) > swipeThreshold) {
      if (delta > 0) {
        previous()
      } else {
        next()
      }
    }
    setTouchStart(null)
  }

  useEffect(() => {
    if (!lightbox) return undefined

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightbox(false)
      }
      if (event.key === 'ArrowLeft') {
        previous()
      }
      if (event.key === 'ArrowRight') {
        next()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightbox, next, previous])

  if (!loadedImages.length) {
    return <div className="min-h-[320px] rounded-md bg-[var(--color-hover)]" />
  }

  return (
    <div>
      <div className="space-y-3">
        <div
          className="group relative overflow-hidden rounded bg-[var(--color-primary)]"
          onPointerDown={(event) => handlePointerDown(event.clientX)}
          onPointerUp={(event) => handlePointerUp(event.clientX)}
        >
          <button className="block w-full disabled:cursor-wait" disabled={waitingForMorePhotos} onClick={() => setLightbox(true)} type="button">
            <img
              src={currentImage}
              alt={title}
              className={`h-[300px] w-full object-cover transition-opacity duration-200 sm:h-[450px] lg:h-[500px] ${imageLoading ? 'opacity-55' : 'opacity-100'}`}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          </button>

          {hasManyImages ? (
            <>
              <button
                aria-label="Previous image"
                className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[var(--color-primary)]/90 text-sm text-white transition hover:bg-[var(--color-accent)] disabled:cursor-wait disabled:opacity-35"
                disabled={navigationLocked}
                onClick={previous}
                type="button"
              >
                <FaChevronLeft />
              </button>
              <button
                aria-label="Next image"
                className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[var(--color-primary)]/90 text-sm text-white transition hover:bg-[var(--color-accent)] disabled:cursor-wait disabled:opacity-35"
                disabled={navigationLocked}
                onClick={next}
                type="button"
              >
                <FaChevronRight />
              </button>
            </>
          ) : null}

          <div className="absolute left-4 top-4 flex items-center gap-2">
            {waitingForMorePhotos || waitingAtLoadedEdge ? (
              <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-normal text-white backdrop-blur">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Loading more photos
              </span>
            ) : null}
            <span className="bg-[var(--color-primary)]/90 px-3 py-1.5 text-xs font-medium text-white">
              {active + 1} / {totalImages}
            </span>
          </div>
          <button aria-label="View fullscreen gallery" className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-[var(--color-primary)]/90 text-sm text-white transition hover:bg-[var(--color-accent)]" type="button" onClick={() => setLightbox(true)}><FaExpand /></button>

          {imageLoading ? (
            <div className="absolute inset-0 grid place-items-center bg-black/20">
              <div className="inline-flex items-center gap-3 rounded-md border border-white/12 bg-black/55 px-4 py-3 text-sm font-normal text-white backdrop-blur">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Loading photo
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {previewImages.map((image, index) => {
            const imageIndex = previewWindowStart + index
            const thumbnailReady = readyThumbnails.has(image)
            return (
              <button
                key={`${image}-${imageIndex}`}
                aria-label={`Show image ${imageIndex + 1}`}
                className={`relative overflow-hidden rounded border-2 bg-[var(--color-primary)] transition ${active === imageIndex ? 'border-[var(--color-accent)] opacity-100' : 'border-transparent opacity-80 hover:opacity-100'}`}
                disabled={navigationLocked}
                onClick={() => selectAndOpenImage(imageIndex)}
                type="button"
              >
                <div className={`absolute inset-0 grid place-items-center bg-white/[0.035] transition-opacity duration-300 ${thumbnailReady ? 'opacity-0' : 'opacity-100'}`}>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
                </div>
                <img
                  src={image}
                  alt={`${title} thumbnail ${imageIndex + 1}`}
                  className={`h-20 w-full object-cover transition-opacity duration-300 sm:h-24 ${thumbnailReady ? 'opacity-100' : 'opacity-0'}`}
                  decoding="async"
                  loading="eager"
                  onLoad={() => markThumbnailReady(image)}
                  onError={() => markThumbnailReady(image)}
                />
              </button>
            )
          })}

          {totalImages > previewImages.length ? (
            <button
              className="inline-flex h-20 flex-col items-center justify-center bg-[var(--color-primary)] px-2 text-sm font-medium text-white transition hover:bg-[var(--color-primary-dark)] sm:h-24"
              disabled={loadingMore}
              onClick={expandThumbnails}
              type="button"
            >
              {loadingMore ? 'Loading Photos...' : <><strong className="text-base">+{Math.max(0, totalImages - previewImages.length)}</strong><span>Photos</span></>}
            </button>
          ) : null}
        </div>

        {expandedThumbnails ? <div className="border-t border-[var(--color-divider)] pt-4">
          <div className="mb-3 flex items-center justify-between gap-3"><p className="text-sm font-semibold text-[var(--color-primary)]">All loaded photos</p><span className="text-xs text-[var(--color-muted)]">{loadedImages.length} of {totalImages}</span></div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {loadedImages.map((image, index) => <button key={`${image}-${index}`} aria-label={`Show image ${index + 1}`} disabled={navigationLocked} onClick={() => selectAndOpenImage(index)} type="button" className={`aspect-[4/3] overflow-hidden rounded border-2 bg-[var(--color-primary)] transition disabled:cursor-wait disabled:opacity-70 ${active === index ? 'border-[var(--color-accent)]' : 'border-transparent opacity-80 hover:border-[var(--color-border)] hover:opacity-100'}`}><img src={image} alt={`${title} thumbnail ${index + 1}`} className="h-full w-full object-cover" decoding="async" loading="lazy" /></button>)}
          </div>
          {loadedImages.length < totalImages ? <button className="mt-4 min-h-11 w-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-medium text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-hover)] disabled:cursor-wait disabled:opacity-70" disabled={loadingMore} onClick={() => void loadMoreImages()} type="button">{loadingMore ? 'Loading photos…' : `Load ${Math.min(loadBatchSize, totalImages - loadedImages.length)} more photos (${loadedImages.length} of ${totalImages})`}</button> : null}
        </div> : null}
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[70] bg-black/95 p-4"
          onPointerDown={(event) => handlePointerDown(event.clientX)}
          onPointerUp={(event) => handlePointerUp(event.clientX)}
          onClick={(event) => { if (event.target === event.currentTarget) setLightbox(false) }}
        >
          <button
            aria-label="Close gallery"
            className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-sm text-white backdrop-blur transition hover:bg-white/20"
            onClick={() => setLightbox(false)}
            type="button"
          >
            <FaTimes />
          </button>

          {hasManyImages ? (
            <>
              <button
                aria-label="Previous image"
                className="absolute left-5 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-sm text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-wait disabled:opacity-35"
                disabled={navigationLocked}
                onClick={previous}
                type="button"
              >
                <FaChevronLeft />
              </button>
              <button
                aria-label="Next image"
                className="absolute right-5 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-sm text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-wait disabled:opacity-35"
                disabled={navigationLocked}
                onClick={next}
                type="button"
              >
                <FaChevronRight />
              </button>
            </>
          ) : null}

          <button
            aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
            className="absolute bottom-5 left-1/2 z-10 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-sm text-white backdrop-blur transition hover:bg-white/20"
            onClick={() => setZoomed((value) => !value)}
            type="button"
          >
            <FaSearchPlus className={zoomed ? 'scale-90 opacity-70' : ''} />
          </button>

          <div className="flex h-full items-center justify-center overflow-auto px-8 py-12 sm:px-12" onClick={(event) => { if (event.target === event.currentTarget) setLightbox(false) }}>
            <img
              src={currentImage}
              alt={title}
              className={`${zoomed ? 'max-h-none max-w-none cursor-zoom-out scale-150' : 'max-h-[84vh] w-full max-w-6xl cursor-zoom-in'} object-contain transition duration-200 ${imageLoading ? 'opacity-55' : 'opacity-100'}`}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
              onClick={() => setZoomed((value) => !value)}
            />
          </div>

          {imageLoading ? (
            <div className="absolute inset-0 grid place-items-center bg-black/20">
              <div className="inline-flex items-center gap-3 rounded-md border border-white/12 bg-black/60 px-4 py-3 text-sm font-normal text-white backdrop-blur">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Loading photo
              </div>
            </div>
          ) : null}

          <div className="absolute bottom-5 right-5 flex items-center gap-2">
            {waitingForMorePhotos || waitingAtLoadedEdge ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-normal text-white backdrop-blur">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Loading more photos
              </span>
            ) : null}
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-normal text-white backdrop-blur">
              {active + 1} / {totalImages}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
