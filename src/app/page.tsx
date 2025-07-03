import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="space-y-16 p-6 md:p-12 max-w-6xl mx-auto text-gray-800">
      
      {/* About Section */}
      <section id="About" className="bg-white py-16 px-6 md:px-12 max-w-5xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-[#6a4a2e] mb-6 text-center">
          About Emerald Counselling
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-2/3 text-gray-700 leading-relaxed text-lg font-light">
            <p>
              At Emerald Counselling, we believe everyone deserves a safe space to be heard and supported. Our mission is to empower you through compassionate care tailored to your unique journey.
            </p>
            <p className="mt-4">
              Whether you&apos;re facing life&apos;s challenges, seeking personal growth, or simply want someone to talk to, our dedicated team is here to listen without judgment and guide you towards healing.
            </p>
            <p className="mt-4">
              We blend evidence-based therapies with empathy and respect, creating a nurturing environment where you can rediscover hope, resilience, and inner peace.
            </p>
          </div>

          <div className="md:w-1/3">
            <Image
              src="/IMG-20250605-WA0010.jpg"
              alt="Counselling session"
              className="rounded-lg shadow-lg object-cover"
              width={400}
              height={400}
            />
          </div>
        </div>
       <section className="relative bg-[#4e3620] text-white overflow-hidden py-20">
  {/* Top Wave Shape */}
  <svg
    className="absolute top-0 left-0 w-full h-16 md:h-24"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
  >
    <path
      fill="#ffffff"
      d="M0,128L60,154.7C120,181,240,235,360,229.3C480,224,600,160,720,144C840,128,960,160,1080,165.3C1200,171,1320,149,1380,138.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
    />
  </svg>

  <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
      <Image
        src="/IMG-20250605-WA0009.jpg"
        alt="Rosemary Wanjiru"
        width={192}
        height={192}
        className="object-cover w-full h-full"
      />
    </div>

    <h2 className="text-3xl md:text-4xl font-serif font-bold underline text-white mb-4">Meet Rosemary</h2>

    <p className="text-base md:text-lg max-w-2xl leading-relaxed text-gray-100">
  Rosemary Wanjiru is a KCPA (Kenya Counselling and Psychological Association) certified psychologist who is a compassionate therapist and embraces a flexible, 
  integrative approach to meet each client’s unique needs. With empathy and experience, 
  she walks alongside clients to help them find clarity, healing, and renewed strength in their journey.
</p>

  </div>

  {/* Bottom Wave Shape */}
  <svg
    className="absolute bottom-0 left-0 w-full h-16 md:h-24"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
  >
    <path
      fill="#fff8ec"
      d="M0,64L60,58.7C120,53,240,43,360,64C480,85,600,139,720,144C840,149,960,107,1080,117.3C1200,128,1320,192,1380,224L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
    />
  </svg>
</section>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-[#fff8ec] py-16 px-6 md:px-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-[#6a4a2e] mb-4 text-center">
          Our Services
        </h2>
        <p className="text-center text-[#5c3b22] max-w-3xl mx-auto mb-10 text-lg font-light">
          Discover a path to emotional clarity and personal growth with Emerald Counselling. Our services are crafted to meet your needs—whether you&apos;re navigating individual challenges, relationship dynamics, or family transitions, we&apos;re here to walk with you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-[#5c3b22]">
          {[
            {
              title: 'Individual Counselling',
              desc: 'Personalized one-on-one support to help you navigate life’s complexities with clarity and confidence.',
              img: '/IMG-20250616-WA0227.jpg',
            },
            {
              title: 'Group Counselling',
              desc: 'Healing through shared experiences—connect with others in a safe, guided space for growth and reflection.',
              img: '/IMG-20250620-WA0001.jpg',
            },
            {
              title: 'Marital Counselling',
              desc: 'Rebuild trust, enhance communication, and rediscover intimacy with compassionate, goal-oriented sessions.',
              img: '/IMG-20250621-WA0008.jpg',
            },
            {
              title: 'Family Counselling',
              desc: 'Strengthen bonds and navigate transitions as a family with collaborative, supportive guidance.',
              img: '/pexels-gustavo-fring-7447260.jpg',
            },
            {
  title: 'Mentorship',
  desc: 'Personalized guidance and encouragement to help individuals grow, set meaningful goals, and navigate life’s challenges with confidence.',
  img: '/pexels-airamdphoto-15189552.jpg',
}

          ].map(({ title, desc, img }) => (
            <div key={title} className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
              <Image src={img} alt={title} className="w-full object-cover" width={400} height={192} />
              <div className="p-6">
                <h4 className="font-semibold text-xl mb-2">{title}</h4>
                <p className="text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-amber-50 p-8 rounded-lg shadow-md border border-amber-100">
        <h3 className="text-3xl font-bold text-amber-700 mb-2">Why Choose Emerald Counselling?</h3>
        <p className="text-amber-900 leading-relaxed">
          At Emerald Counselling, we believe mental health care should be compassionate, accessible, and affordable. Whether you&apos;re navigating personal struggles or seeking support for your family, our tailored sessions are designed to meet you where you are — and walk with you every step of the way.
        </p>

        <ul className="mt-6 list-disc list-inside space-y-2 text-amber-800 text-base">
          <li><strong>Affordable Pricing:</strong> Professional care without the financial strain.</li>
          <li><strong>Personalized Support:</strong> Every session is tailored to your unique story.</li>
          <li><strong>Safe &amp; Confidential:</strong> We provide a space where you can speak freely and safely.</li>
          <li><strong>Flexible Access:</strong> Meet with us online or in-person at your convenience.</li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h3 className="text-2xl font-bold text-amber-700">Ready to Start Your Healing Journey?</h3>
        <p className="mt-2 text-amber-900">
          Connect with Emerald Counselling today and take the first step toward emotional wellness and clarity.
        </p>
       <div className="mt-8 flex justify-center">
   
 <Link href="/Booksession">
  <button className="mt-10 bg-yellow-700 text-white font-semibold px-8 py-3 rounded-md shadow-lg hover:bg-yellow-800 transition">
    Get Started
  </button>
</Link>

  </div>
      </section>

      {/* Final Section with Background */}
      <section
        className="relative h-96 bg-cover bg-center text-white flex items-center justify-center"
        style={{ backgroundImage: "url('/pexels-barbara-olsen-7880782.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center px-4">
          <h3 className="text-3xl md:text-4xl font-bold mb-2">Together, we can help your smile shine again</h3>
          <p className="text-sm md:text-base max-w-xl mx-auto">
            At Emerald Counselling, healing begins with compassion, courage, and connection. Let&apos;s take that journey—together.
          </p>
        </div>
      </section>

    </main>
  );
}
