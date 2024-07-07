import { asyncHandler } from "../utils/asyncHandler.js";

const getStudentCourses = (req, res) => {
    console.log("cookies:", req.cookies)
    const mycookies = 'my cookies'

    res.cookie("my", mycookies)
    res.send("created coolies")


}
export { getStudentCourses }