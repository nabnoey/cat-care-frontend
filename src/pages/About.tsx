import { FaCat, FaUserMd, FaHeart } from 'react-icons/fa';

function About() {
  return (
    <div className="container mx-auto p-8 font-roboto">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-pacifico text-primary mb-4">About Us</h1>
        <p className="text-lg">
          Welcome to Cat Care, your one-stop solution for all your cat's needs. We are passionate about cats and dedicated to providing the best services to ensure their health and happiness.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8 mb-12">
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-bold mb-4">Our Mission <FaHeart className="inline text-secondary" /></h2>
          <p className="mb-4">
            Our mission is to provide a safe, comfortable, and stimulating environment for every cat in our care. We believe that every cat deserves to be treated with love, respect, and compassion.
          </p>
          <p>
            We are a team of certified cat lovers, and we are committed to providing the highest quality of care for your furry family members.
          </p>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <FaCat className="text-9xl lg:text-[15rem] text-primary" />
        </div>
      </div>

      <div>
        <h2 className="text-4xl font-bold text-center mb-8">Meet Our Team <FaUserMd className="inline text-secondary" /></h2>
        <div className="flex justify-center gap-8">
          <div className="card w-72 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <h3 className="card-title mt-4">Jane Doe</h3>
              <p>Founder & Head Caretaker</p>
            </div>
          </div>
          <div className="card w-72 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <h3 className="card-title mt-4">John Smith</h3>
              <p>Veterinarian</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
