const API_BASE = import.meta.env.VITE_API_URL || '';
import { useEffect, useState } from 'react';
import useReveal from '../hooks/useReveal';
import ImageAutoSlider from '../components/ImageAutoSlider';
import './Gallery.css';

const CATEGORIES = ['All', 'Wedding', 'Maternity', 'Birthday', 'School', 'College', 'Celebration'];

const ALL_IMAGES = [
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5QVTjugzSOWUYLeUXOszGJ_MScs3RGGDdDnyBT9Yk8Ktqy6fcmWis2NgoOU0uCpP02t9KPDzTbBoituE6fkD13d85Vq9PABQkdcOra1lr1LA-uHIulnKRQiT2p1RIAMp2le71Ax-eRI0Rl1d7D_j_8ygmZ5NQ0wY6P45wJ78jrFjpaUnJcBc0rphxKRpHCfxKz-ALvPNVvSrXE3BKTV9SvhQOdqTawq1F1VpZewwSv6mgWa9nhhrzAjnEaLTYffmfOoknLk7jjGE', tag: 'Wedding', alt: 'Wedding portrait' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXUa81LqyG6kcXtbpBD46M8shTj5XLyyvqtPRiVGR-CPCK4j7nr6Z9dMEppF3jZdTdY6j74CjhDlCLCRIb8ZMR0ymD9EG6dxY0bXIPQMKVZTwahTwQTk-c7CoRgsc8TFPZ4B5l5v1b8Xj7GZ91JSL-Ka4qveKpRrz9-KSCBCmKMV-gJt8W4ZpuJMwPeLn1D0xWMfFWXXwpI4W08g7jzNac0B1Pdo7pP5yVCH0k9NBbhBjaoac1JCPq5ACNfYqPWELK-8prW833F-E', tag: 'Maternity', alt: 'Maternity golden hour' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATjn9cmZuuoX3v_bmbGupGOEFcjHDTnEU-uHxNS2kbUEUkWr08rAIXMqT4hHwNMkDSErvvzvIl5eFAcSqPuYn1cBoqlAdoBCIVvdNcXnbMmvfuRrr1qfbX-1qhs-LQHdNPBn84q6pryf0BIB1WCUlsNtyLQ9iBjDtNQC4JYXbrtBUoRxSCEMqibViTdKlWNTwYfACTPyQlBqGCxTpxEgSVAo8SeXixrZfpSA0dlxdr1wiS9mYuWMTpWnOVflH5Z08jWrrZ75YfDas', tag: 'Celebration', alt: 'Anniversary dinner table' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgt0AlzwqWyDIE-rgYdIrptEW5EEw2cNajB5_KgqkhnDaElBLfXtbsK6X64Vfk8WS1a2vDcsbPWigyXO7iWnxUwKYWfWOasuA9QiQxM3XQE8KM0e9xayRFI18GURXpC2fyP0YHpaza0jFDi_bEw-DkbmNFvzRqQ1zexWDsih0HmLYLyEkfLUMDoK1qX9wYL8aRH5Urxi6R3Pgs7ObzlceqY5Z-rdkTKgRdsbYCvwBMsBoS8rICGRpyc1cPJRm3sIhNuxO-xt4KH40', tag: 'Wedding', alt: 'Wedding cake' },
  { src: '/milestone.jpg', tag: 'College', alt: 'Graduation' },
  { src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2000&auto=format&fit=crop', tag: 'Maternity', alt: 'Portrait session' },
  { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop', tag: 'Wedding', alt: 'Wedding couple' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7TeVxfKMboizcVfG9FtVI6mIkbFat9OWMv5kR70eNjoAc7TeK58I8leMk6PreWStt5IuWONDBB0HFAoFzQLFkmYrL3Gk-gIEGDqcY9pPKUeULoxoNkVOm3nb_nQBwr8C42BYoBN_F-zhFc88QHOZH4sOJE22BW046OOo5qtOgB7WUx4eLI5XfyNXWHKTVFFCoZ66afn2yupUDmZY0BrVf_UNc-BPFavcRDIQmB2Tu9NfBJ-P1sOTu0lvA1oKErAr1tENEbYA-8Nk', tag: 'Celebration', alt: 'Wedding garden table' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKvhDxhb2iPmYfPTSkXTqrCW0JA7e0CpZlrz3NndZQH8j4NYXX_uKF9ABmEobrIhGkhqVQHVpmdy4BJLmSnja0-t_q178mKAQ-YDNMjo3e3FSYZ2tW8nZcnVVO2uTFdDwiSemQ_rLRhRfWtmw0T2wkVRqyBXudyLhmnVfzqLnoXUPYf3YkVTxDQ96_rI7ZwN6W4LyESn82QqSTFQiwhPZXTVl6GADPWdJcCUems8NKX0_Fiy3_WveuUF1i7BzboEmPa65rmgdxcfU', tag: 'Wedding', alt: 'Wedding arch vineyard' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDThua3769ZdSLAAyew3m2yZ_JflHzAbel0nt_kEYjuhQHN5qM5U-UbGj1fhDvnh4dLw851bXxKebG3Wy1zQ9oxuAvmFGmDH0ullM90Cv43Nxc2V4cezhSNTY1kGr7Ecjakjzu1L88PVmsR6jsxdocT4D5QxjJrOmwu3FVVYZZSpsNvYKNX068TBCbvFbqw_an-YYH77_T7Uj2P2DD0DSGMvOGM9dOKb1sweraTFZj2lvAiOj6MczANBxMIdwQ2Pk4Ah_6JlofpK0Y', tag: 'Birthday', alt: 'Birthday portrait' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZEsZyB6FclpAjkTAibWBMZTKHLRW96EKOYnaEv03SQeP5TrDRSOknYQYhS2S1MxEaxoO2Qiw0WR_EBwilZ2IE9N6x9BPqrxgCXT0n3nJsSdWi193euA7PBDVbFdQvOFN_9hgduNoBKhnbNnCY_2K-wA6XpOEuQX2ca10SRtr4fcJDJ9pm5K3KaEMaMWdAY3PX0lFxGp-6x671B76Txp32qU01v3VxR_9hEWHP092vmApPsxgC_IkDtUoN200KoV-EWtamQiaNOyo', tag: 'School', alt: 'School event' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsxx2jsQxOLS6u7CcW1FeeOLbTUL6liIbqczzVKIOYPADHF1zM5Yo2JFIzN_ztKOeMF4ZjRtpV5sckBq_fpHGN7eO_8XsBpi1BPtWPr14w-_SI1EUigvMt8bhYp_klpnGY6E1WnqCnpdM8SMyBWeHgazZekaXExVIJmMrTeD0IfsreP4_2XpR91MYDQSWFNZ_SKZaWHyKdFWAioYiY8-6kucm1IlHHp6H1WopAEGYdMxfFtMZpcX5qYS63PhuZtKz_ztYbrm8MnPc', tag: 'College', alt: 'College event' },
  { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop', tag: 'Wedding', alt: 'Wedding couple outdoor' },
  { src: '/birthday.png', tag: 'Birthday', alt: 'Birthday celebration party' },
  { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2000&auto=format&fit=crop', tag: 'School', alt: 'Classroom or school activity' },
  { src: '/maternity.jpg', tag: 'Maternity', alt: 'Maternity portrait session' },
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [images, setImages] = useState(ALL_IMAGES);
  const pageRef = useReveal();

  useEffect(() => {
    document.title = 'Gallery | Pixel Memories';
    window.scrollTo(0, 0);

    fetch(`${API_BASE}/api/gallery`)
      .then(res => res.json())
      .then(data => {
        if (data && data.images && data.images.length > 0) {
          const formatted = data.images.map(img => ({
            src: img.url,
            tag: img.category,
            alt: img.title || img.category
          }));
          // Prepend new images from backend to the default demo images
          setImages([...formatted, ...ALL_IMAGES]);
        }
      })
      .catch(err => console.error("Failed to fetch gallery", err));
  }, []);

  const filtered = activeFilter === 'All'
    ? images
    : images.filter(img => img.tag === activeFilter);

  return (
    <div className="page-wrapper gallery-page" ref={pageRef}>
      {/* Hero */}
      <section className="gallery-hero reveal">
        <div className="container gallery-hero__inner">
          <span className="text-label-sm gallery-hero__eyebrow">Our Portfolio</span>
          <h1 className="text-display-lg">Expanded Gallery</h1>
          <p className="text-body-lg gallery-hero__sub">
            Every frame a story. Every story a treasure. Browse our curated collection of life's most beautiful moments.
          </p>
        </div>
      </section>

      {/* Featured Auto Slider */}
      <section className="reveal">
        <ImageAutoSlider images={images.map(img => img.src)} />
      </section>

      {/* Filter Chips */}
      <section className="gallery-filter">
        <div className="container gallery-filter__inner reveal">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`gallery-filter__chip text-label-sm ${activeFilter === cat ? 'gallery-filter__chip--active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="gallery-grid-section">
        <div className="container">
          <div className="gallery-masonry reveal">
            {filtered.map(({ src, tag, alt }, i) => (
              <div key={`${tag}-${i}`} className="gallery-masonry__item img-zoom">
                <img referrerPolicy="no-referrer" src={src} alt={alt} />
                <div className="masonry__overlay" />
                <div className="masonry__tag-wrap">
                  <span className="badge">{tag}</span>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-body-lg gallery-empty">No images in this category yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
