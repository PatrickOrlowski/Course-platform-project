'use client'
import React from 'react'
import YouTube from 'react-youtube'

export const YoutubeVideoPlayer = ({
    videoId,
    onFinishedVideo,
}: {
    videoId: string
    onFinishedVideo?: () => void
}) => {
    return (
        <YouTube
            videoId={videoId}
            onEnd={onFinishedVideo}
            className={'w-full h-full'}
            opts={{ width: '100%', height: '100%' }}
        />
    )
}
