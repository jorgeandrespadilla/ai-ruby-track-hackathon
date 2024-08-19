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
                  src="/images/member_jorgeandrespadilla.jpeg"
                  alt="Jorge Andres Padilla"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <p className="mt-2 text-center text-sm font-medium text-white">Jorge Andres Padilla</p>
              </li>
              <li className="flex flex-col items-center">
                <img
                  src="/images/member_gabrielapadilla.jpeg"
                  alt="Gabriela Padilla"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <p className="mt-2 text-center text-sm font-medium text-white">Gabriela Padilla</p>
              </li>
              <li className="flex flex-col items-center">
                <img
                  src="/images/member_jennifermena.jpeg"
                  alt="Jennifer Mena"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <p className="mt-2 text-center text-sm font-medium text-white">Jennifer Mena</p>
              </li>
              <li className="flex flex-col items-center">
                <img
                  src="/images/member_guleednuh.jpeg"
                  alt="Guleed Nuh"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <p className="mt-2 text-center text-sm font-medium text-white">Guleed Nuh</p>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
