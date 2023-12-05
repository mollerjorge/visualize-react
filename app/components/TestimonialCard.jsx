import star from "../images/stars-2.png";

const TestimonialCard = ({ text, name, photoUrl, occupation }) => {
  return (
    <div className="after:absolute after:w-full after:left-[1px] after:top-[1px] after:rounded-3xl after:bottom-0 after:bg-slate-800 after:z-10   before:bg-gradient-to-br relative  before:right-0 before:bottom-0 before:-z-1 before:via-slate-700 before:from-purple-400 before:to-transparent before:absolute before:-top-2 before:-left-2   rounded-3xl overflow-hidden items-start p-8 flex justify-start flex-col w-[350px] mx-3">
      <div className="relative z-20 flex flex-col w-full">
        <div className="flex items-start flex-col justify-start w-full">
          <div className="flex gap-4">
            <img
              src={photoUrl}
              alt="testimonial profile"
              className=" rounded-full w-16 h-16"
            />
            <div className="flex flex-col flex-1 mb-5">
              <p className="max-w-[400px] whitespace-break-spaces text-white">
                <span className="font-bold">{name}</span>
              </p>
              <p className="text-sm">{occupation}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-5 mb-5">
            <img src={star} alt="star icon" className="w-28" />
          </div>
        </div>

        {text}
      </div>
    </div>
  );
};

export default TestimonialCard;
