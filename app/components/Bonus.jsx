import starsBg from "../images/stars-bg.webp";

export default function Bonus() {
  return (
    <div className="py-20 bg-body-1 relative">
      <img
        src={starsBg}
        alt="stars background"
        className="absolute w-1/4 -top-40"
      />
      <div className="max-w-7xl mx-auto flex items-center flex-col overflow-hidden">
        <div className="bg-purple-2 bg-opacity-10 mb-10 text-purple-2 rounded-full py-4 px-8 font-medium">
          Bonus Gift
        </div>

        <h2 className="text-[40px] max-w-lg text-center leading-tight font-bold">
          React Interview Questions & Answers ebook
        </h2>
        <p className="text-lg max-w-2xl mb-20 text-center">
          You'll also get the React interview ebook so that you can ace your next interview by learning how to answer the top most asked React questions.
        </p>

        <div className="w-fit  bg-[#D9D9D9] max-w-4xl bg-opacity-10 relative p-10 mx-auto rounded-[42px]">
          <video
            id="bonus-video"
            className="w-full mx-auto "
            muted
            loop
            autoPlay
          >
            <source
              src="https://res.cloudinary.com/dptgkdbjg/video/upload/v1700425788/interview_challenges_book_orhlnc.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
