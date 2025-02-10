import React from 'react'

const Video = () => {
    return (
        <div>
            <iframe
                className="landing-video-width"
                src={`https://www.youtube.com/embed/V-E0JUSPruQ`}
                frameborder="0"
                allowfullscreen
            ></iframe>
        </div>
    )
}
 
export default Video;