import React from 'react';

/**
 * Testimonial card for displaying client reviews.
 * @param {Object} props
 * @param {Object} props.testimonial - Testimonial data
 */
const TestimonialCard = ({ testimonial }) => {
    const { quote, author, role, avatar, rating = 5, verified = true } = testimonial;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow h-full flex flex-col">
            {/* Stars */}
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-earth-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>

            {/* Quote */}
            <blockquote className="text-earth-700 flex-1 mb-6 leading-relaxed">
                "{quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3">
                {avatar ? (
                    <img
                        src={avatar}
                        alt={author}
                        className="h-12 w-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                        {author?.charAt(0) || 'A'}
                    </div>
                )}
                <div>
                    <p className="font-semibold text-earth-900">{author}</p>
                    <div className="flex items-center gap-2">
                        {role && <p className="text-sm text-earth-500">{role}</p>}
                        {verified && (
                            <span className="text-xs text-blue-600 flex items-center gap-1">
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verified
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;
