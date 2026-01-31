import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function Contact() {
  return (
    <div className="container mx-auto p-8 font-roboto">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-pacifico text-primary mb-4">Contact Us</h1>
        <p className="text-lg">
          Have questions? We'd love to hear from you.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <div className="card bg-base-100 shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <div className="flex items-center mb-4">
              <FaEnvelope className="text-2xl text-primary mr-4" />
              <a href="mailto:contact@catcare.com" className="link link-hover">contact@catcare.com</a>
            </div>
            <div className="flex items-center mb-4">
              <FaPhone className="text-2xl text-primary mr-4" />
              <a href="tel:123-456-7890" className="link link-hover">123-456-7890</a>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-2xl text-primary mr-4" />
              <p>123 Cat Street, Meowville</p>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="card bg-base-100 shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Send us a Message</h2>
            <form>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Your Name</span>
                </label>
                <input type="text" placeholder="Your Name" className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Your Email</span>
                </label>
                <input type="email" placeholder="Your Email" className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Message</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" placeholder="Your Message"></textarea>
              </div>
              <button type="submit" className="btn btn-primary mt-4">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
