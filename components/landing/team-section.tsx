export default function TeamSection() {
  return (
    <section
      id="clients"
      className="text-center mx-auto max-w-[80rem] px-6 md:px-8"
    >
      <div className="py-14">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="text-center text-sm font-semibold text-gray-600">
            MEET OUR TEAM
          </h2>
          <div className="mt-6">
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
              <li className="flex flex-col items-center">
                <img
                  src={`https://your-image-url.com/photo1.jpg`}
                  alt="Team Member 1"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <p className="mt-2 text-center text-sm font-medium text-gray-800">Name 1</p>
              </li>
              <li className="flex flex-col items-center">
                <img
                  src={`https://your-image-url.com/photo2.jpg`}
                  alt="Team Member 2"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <p className="mt-2 text-center text-sm font-medium text-gray-800">Name 2</p>
              </li>
              <li className="flex flex-col items-center">
                <img
                  src={`https://your-image-url.com/photo3.jpg`}
                  alt="Team Member 3"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <p className="mt-2 text-center text-sm font-medium text-gray-800">Name 3</p>
              </li>
              <li className="flex flex-col items-center">
                <img
                  src={`https://your-image-url.com/photo4.jpg`}
                  alt="Team Member 4"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <p className="mt-2 text-center text-sm font-medium text-gray-800">Name 4</p>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
