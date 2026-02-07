import NextTopLoader from "nextjs-toploader";

export const TopLoader = () => (
  <NextTopLoader
    color="var(--primary)"
    initialPosition={0.08}
    crawlSpeed={200}
    height={3}
    crawl
    showSpinner
    easing="ease"
    speed={200}
    shadow="0 0 10px var(--primary),0 0 5px var(--primary)"
    template='<div class="bar" role="bar"><div class="peg"></div></div> 
<div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
    zIndex={1600}
  />
);
