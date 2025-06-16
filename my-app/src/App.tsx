import { useEffect, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import './App.css'

const maximumNumberOfCatsToLike = 10
const cataasWebsite = "https://cataas.com/cat?json=true&width=200&height=200"

async function getCatUrlArrayFromAPI(): Promise<string[]> {
  const catUrlArray: string[] = []
  let currentNumberOfCats = 0

  while (currentNumberOfCats < maximumNumberOfCatsToLike) {
    try {
      const res = await fetch(cataasWebsite);
      const data = await res.json();
      catUrlArray.push(data.url);
      currentNumberOfCats += 1;
    } catch (err) {
      console.error("Failed to fetch cat", err);
    }
  }

  return catUrlArray
}

function SwipeCats({
  catUrlArray,
  setLikedCatIndexArray,
  setHasDoneLikingCats
}: {
  catUrlArray: string[],
  setLikedCatIndexArray: React.Dispatch<React.SetStateAction<number[]>>
  setHasDoneLikingCats: React.Dispatch<React.SetStateAction<boolean>>
}) {

  const [catIndex, setCatIndex] = useState<number>(0)
  const catUrlArrayLength = catUrlArray.length
  const currentCat = catUrlArray[catIndex]

  const addToLikedCatIndexArray = (index: number) => {
    setLikedCatIndexArray(prev => [...prev, index])
  }

  const checkIfToMoveToNextCat = () => {
  if (catIndex < catUrlArrayLength - 1){ // It is 0 indexed and not 1 indexed. Stop confusing it with Roblox's Lua!
      setCatIndex(prev => prev + 1)
    } else{
      setHasDoneLikingCats(true)
    }
  }

  const swipeHandlers = useSwipeable({
  onSwipedLeft: () => {checkIfToMoveToNextCat()},
  onSwipedRight: () => {
    addToLikedCatIndexArray(catIndex)
    checkIfToMoveToNextCat()
  },
  trackTouch: true,
  trackMouse: true
  })

  return (
      <div className="swipe-cats-container">
      {currentCat ? (
        <>
          <img
            src={currentCat}
            alt={`Cat ${catIndex}`}
            className="swipe-cats-image"
          />
          <p>Swipe 👉 to like, 👈 to skip</p>
          <div className="swipe-cats-overlay" {...swipeHandlers} />
        </>
      ) : (
        <p>Loading cats...</p>
      )}
    </div>
  )
}

function ShowLikedCats({
  catUrlArray,
  likedCatIndexArray
}: {
  catUrlArray: string[],
  likedCatIndexArray: number[]
}){
  const numberOfCatsLiked = likedCatIndexArray.length
  const hasLikedCats =  numberOfCatsLiked > 0
  return (
    <div className="liked-cats-container">
      <h2 className="liked-cats-title">
        {hasLikedCats
          ? <div>You liked {numberOfCatsLiked} cats!</div>
          : <div>You haven't liked any cats yet. 😿</div>}
      </h2>
      {hasLikedCats && (
        <div className="liked-cats-flex">
          {likedCatIndexArray.map((index) => (
            <img
              key={index}
              src={catUrlArray[index]}
              alt={`Liked Cat ${index}`}
              className="liked-cat-image"
            />
          ))}
        </div>
      )}
    </div>
  )
}

function App() {

  const [catUrlArray, setCatUrlArray] = useState<string[]>([])
  const [likedCatIndexArray, setLikedCatIndexArray] = useState<number[]>([])
  const [hasDoneLikingCats, setHasDoneLikingCats] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
      const catArrayFromAPI = await getCatUrlArrayFromAPI()
      setCatUrlArray(catArrayFromAPI)
    })()
  }, [])

  return (
    <>
      {hasDoneLikingCats ? (
        <ShowLikedCats catUrlArray={catUrlArray} likedCatIndexArray={likedCatIndexArray}/>
        
      ) : (
        <SwipeCats catUrlArray={catUrlArray} setLikedCatIndexArray={setLikedCatIndexArray} setHasDoneLikingCats={setHasDoneLikingCats} />
      )}
    </>)
}

export default App