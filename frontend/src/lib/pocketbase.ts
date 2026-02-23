import PocketBase from "pocketbase"

const pb = new PocketBase(
  import.meta.env.DEV ? "http://localhost:8090" : window.location.origin
)

pb.autoCancellation(false)

export default pb
