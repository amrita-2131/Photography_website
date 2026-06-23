import { Link } from 'react-router-dom';

const SERVICES = [
  {
    icon: 'favorite',
    title: 'Wedding',
    desc: 'Timeless, editorial documentation of your most significant commitment, capturing every nuance and emotion.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgt0AlzwqWyDIE-rgYdIrptEW5EEw2cNajB5_KgqkhnDaElBLfXtbsK6X64Vfk8WS1a2vDcsbPWigyXO7iWnxUwKYWfWOasuA9QiQxM3XQE8KM0e9xayRFI18GURXpC2fyP0YHpaza0jFDi_bEw-DkbmNFvzRqQ1zexWDsih0HmLYLyEkfLUMDoK1qX9wYL8aRH5Urxi6R3Pgs7ObzlceqY5Z-rdkTKgRdsbYCvwBMsBoS8rICGRpyc1cPJRm3sIhNuxO-xt4KH40',
  },
  {
    icon: 'pregnant_woman',
    title: 'Maternity',
    desc: 'Graceful, radiant portraiture honoring the miraculous journey of motherhood in a serene setting.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmUgELl8OnbtcKG5VOk616VfBiWjO2XEyNLqLh7GbX2CSNUVHoe5Bu7eacn9DT_mRbKKhUgjnY2LOyjWqEtQdMZLsMJThMCB-ZvWEEz69F7ZqmHwp-x63JiFjBl4B6fcEcTrYYdaadLoktfWUSS2TshjH1NLoSN7pAaWmXzCcpo7vdwEE7FTHM9YPDtLFvKwmk1g9INNEKri1W1GIKE-9i7UGRff5jzB6zcH138L-9N0Hj2qMImWbn6G5Bz9D4tVU6gSe3rdIqs-w',
  },
  {
    icon: 'cake',
    title: 'Birthday',
    desc: 'Vibrant, joyful captures of your annual milestones, bringing out the authentic smiles and celebration.',
    img: '/birthday.png',
  },
  {
    icon: 'school',
    title: 'School Events',
    desc: 'Professional preservation of academic achievements, performances, and foundational memories.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC25RDinpyrg6EZbxFfkGmr99eoHSGz0fKg1wNtjWspWYSzU02upMblklJpHAHeyOalwSHkGl5oZ_VLW2ptDNrrId-Emcl0MmW0MCErdPBtHjN9T3mbgwgF6cbIlyFn8i5wycdR7TTTHcrz4x4hs3PbJ7LCnshRBos76pJtXFaHLD0cqLdlyCOnXMMDfvI3V9xkw3fnXzUaqzlHk-4-FFIoO8s-1niIe_X0a-yiRumFY_xLjsarZDMYrZlFFuOc78QzAEH-7TJkdZY',
  },
  {
    icon: 'local_library',
    title: 'College Events',
    desc: 'Dynamic, compelling photography for graduations, galas, and momentous collegiate gatherings.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIdr2yCoFToCTkG7gCmq7jRm1yWEDsPvhnSd1bupLCtuxGOw_bjpxm5HWQlb_S5f20BxFWAyklzxB_-QdKNjHH4Xy-7up3pKCEWbaCOvIWKaDaTSovpw6HWh7X65lS3ShEWLxDBy1s01eau3dN8q-biGvkQv1K1dn6qmY0-VuelVyZju7KaTMzwv_vVkHhMupgn2UPwH4AoVJI-FDoAAX6oWxuWt1mRVoAiPbNcncfARy_GN7PPhWllldHlezupbvDnGsbyKzjpCw',
  },
  {
    icon: 'celebration',
    title: 'Life Celebrations',
    desc: 'From anniversaries to reunions, documenting your unique narrative with sophistication and care.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2QpYrZcF7YrbgY-nSBJjVLsnKj8OBxmwdZs8CXA20TXT63gITgOdD7L-mIxbKuJzoQngJHZrsEDsu1esFWlH_JZ0JYFFx1dgY5e7XQ0MuV6Cxdo5-iEtEiwdrphV58wQYsJj7th6Bt6lIq5KOxxFTSWE9t_bY0VekgVee9bHAv3zJWpwE1Pj10z7qO_u64g-22FH89RWvlKF9eT-_tImWS2vPBp7-e0bseJ9vGATz755qomy5tDOqLBogXpI-phKEwaMY-H9xDtM',
  },
];

export default function Services() {
  return (
    <section className="py-section-gap bg-surface-container-lowest" id="services">
      <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 reveal">
          <div className="max-w-2xl">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-4">Our Expertise</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Elevating every milestone into a breathtaking visual narrative. We specialize in artful documentation across life's most precious occasions.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {SERVICES.map(({ icon, title, desc, img }, i) => (
            <div key={i} className="group flex flex-col bg-surface p-10 rounded-DEFAULT shadow-[0_20px_40px_rgba(200,142,167,0.03)] hover:shadow-[0_40px_40px_rgba(200,142,167,0.08)] transition-all duration-500 ease-out border border-surface-container h-full reveal">
              <div className="img-zoom mb-8 h-48 w-full rounded-DEFAULT">
                <img referrerPolicy="no-referrer" src={img} alt={title} className="w-full h-full object-cover" />
              </div>
              <span className="material-symbols-outlined text-4xl text-primary-container mb-8 group-hover:-translate-y-2 transition-transform duration-500">{icon}</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-3">{title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8 flex-grow">{desc}</p>
              <Link to="/services" className="inline-flex items-center font-label-sm text-label-sm uppercase tracking-widest text-primary group-hover:text-primary-container transition-colors mt-auto">
                  Explore <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
