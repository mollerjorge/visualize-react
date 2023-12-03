import profileImageUrl from '../images/profile-picture.jpeg';

export default function Why() {
  return (
    <div className="max-w-7xl mx-auto  mb-20">
      <div className="flex pt-5 lg:mx-auto mx-5 max-w-4xl items-center  flex-col mt-40">
        <h2 className="text-[40px] font-bold text-center">
          Why I created this?
        </h2>
        <p className="mt-5 text-lg font-medium max-w-3xl text-center">
          Each of my videos and infographics addresses a unique problem that
          every React developer faces at some point. Allow me to share a brief
          story about the inspiration behind creating this particular learning
          system.
        </p>

        <div className="rounded-2xl px-10 lg:px-40 py-20 text-lg bg-bg-dark-1 border border-light-1 mt-20">
          <img
            src={profileImageUrl}
            className="rounded-full w-32 mb-20 mx-auto"
          />
          <p className="mb-8">
            Hey, I'm George. I've been a software engineer for over a decade and
            I've built applications with React at every scale, from startups
            with dozens of users to large-scale applications with thousand of
            users.
          </p>
          <p className="mb-8">
            After enrolling in numerous online courses and rarely completing
            them, and poring over thousands of lines of documentation, I
            realized the need for materials that were both easily digestible and
            comprehensive in exploring React's depths.
          </p>
          <p>
            My creation embodies this vision, offering a streamlined, in-depth
            learning experience tailored for those embarking on their React
            journey, just as I once did.
          </p>
        </div>
      </div>
    </div>
  );
}
