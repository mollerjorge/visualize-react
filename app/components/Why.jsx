import profileImageUrl from '../images/profile-picture.jpeg';

export default function Why() {
  return (
    <div className="max-w-7xl mx-auto mb-20">
      <div className="flex pt-5 lg:mx-auto mx-5 max-w-4xl items-center flex-col mt-40">
        <div className="bg-purple-2 bg-opacity-10 mb-10 text-purple-2 rounded-full py-4 px-8 font-medium">
          Who Made This
        </div>
        <h2 className="text-[40px] font-bold text-center max-w-lg leading-tight">
          Built by a dev who spent years learning the hard way
        </h2>

        <div className="rounded-2xl px-10 lg:px-40 py-20 text-lg bg-bg-dark-1 border border-light-1 mt-20">
          <img
            src={profileImageUrl}
            className="rounded-full w-32 mb-20 mx-auto"
            alt="george moller profile"
          />
          <p className="mb-8">
            Hey, I'm George. After a decade of React (startups, scale-ups, apps serving millions), I realized most developers struggle because they never learned the WHY.
          </p>
          <p className="mb-8">
            I spent hundreds of hours on courses that taught syntax, not thinking. Documentation that explained APIs, not decisions. Tutorials that showed code, not reasoning.
          </p>
          <p className="mb-8">
            So I built the resource I wished existed. <span className="text-purple-400 font-bold">Visual. Practical. Dense.</span> The mental models I use every day, distilled into formats that actually stick.
          </p>
          <p className="mt-8 text-white font-medium">
            This isn't another time sink. It's an investment that pays back in your first week.
          </p>
        </div>
      </div>
    </div>
  );
}
