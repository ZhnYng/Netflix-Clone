import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const StarRating = ({filmId}) => {
  const [rating, setRating] = React.useState(0);
  const [error, setError] = React.useState();
  const [comment, setComment] = React.useState("");
  const nagivate = useNavigate();
  const stars = [1, 2, 3, 4, 5];

  const handleRating = (newRating) => {
    setRating(newRating);
  };

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const handleMouseMove = (newRating) => {
    setRating(newRating);
  }

  const handleSubmit = () => {
    console.log({
      film_id: filmId,
      stars: rating,
      review: comment
    })
    axios.post('/rating', {
      film_id: filmId,
      stars: rating,
      review: comment
    }, {headers: {authorization:`Bearer ${localStorage.getItem('token')}`}})
      .then(res => {
        console.log(res);
        alert("Thanks for leaving a review!");
        window.location.reload();
      })
      .catch(err => {
        if(err.response.status === 401){
          alert("Login or create an account to leave a review");
          nagivate('/login');
        }
        setError(err.response.data.message)
        console.log(err);
      })
  }

  return (
    <div className="flex flex-col">
      <div className="flex">
        {stars.map((star) => (
          <label
            key={star}
            className={`cursor-pointer text-gray-500 ${
              star <= rating ? "text-yellow-400" : ""
            }`}
            onMouseOver={() => handleMouseMove(star)}
          >
            <input
              type="radio"
              name="rating"
              value={star}
              onChange={() => handleRating(star)}
              checked={rating === star}
              className="hidden"
            />
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27Z"
                fill="currentColor"
              />
            </svg>
          </label>
        ))}
      </div>
      <textarea
        className="my-4 py-2 px-3 border rounded-md focus:outline-none focus:shadow-outline-blue-500 text-black"
        placeholder="Write your comment here..."
        value={comment}
        onChange={handleComment}
      ></textarea>
      <button
        onClick={handleSubmit}
        className='bg-red-600 hover:bg-red-900 px-6 py-2 self-end w-32 rounded cursor-pointer text-white'
      >
        {error ? error : 'Submit'}
      </button>
    </div>
  );
};

export default StarRating;
