import { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

/* ── Pexels — African learning & education context ──────────────── */
const PX = (id, w = 400, h = 220) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

const LEVEL_COLORS = {
  beginner:     'bg-green-500/20 text-green-300 border border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  advanced:     'bg-red-500/20 text-red-300 border border-red-500/30',
};
const LEVEL_ICONS = { beginner: '🌱', intermediate: '📈', advanced: '🔥' };

/* African students and professionals studying — all IDs verified from local previews */
const LEVEL_IMGS = {
  beginner:     PX(1181671),   // person on phone/learning ✓
  intermediate: PX(1181519),   // person studying/outdoor ✓
  advanced:     PX(3184291),   // creative professional at work ✓
};

export default function LearningCenter() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    api.get('/learning/courses').then(r => setCourses(r.data));
    if (user) {
      api.get('/learning/my-courses').then(r => setMyCourses(r.data));
      api.get('/ai/learning-recommendations').then(r => setRecommendations(r.data));
    }
  }, [user]);

  const enroll = async id => {
    await api.post(`/learning/courses/${id}/enroll`);
    const r = await api.get('/learning/my-courses');
    setMyCourses(r.data);
  };

  const enrolled = new Set(myCourses.map(c => c.id));
  const displayed = tab === 'mine' ? myCourses : tab === 'recommended' ? recommendations : courses;

  return (
    <div className="min-h-screen bg-dark">

      {/* Hero */}
      <div className="relative overflow-hidden">
        <img
          src={PX(1181671, 1600, 400)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <span className="badge bg-primary/20 text-primary border border-primary/30 mb-3 inline-block">🎓 Learning Center</span>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Upskill. Earn Points. Grow.</h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl">
            300+ courses built for African workers. Complete a course, earn FIXR points, unlock better gigs.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Tabs — horizontally scrollable on mobile */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
          {[
            ['all',         '📚', 'All Courses'],
            ['recommended', '✨', 'For You'],
            ['mine',        '🎯', 'My Courses'],
          ].map(([t, icon, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition whitespace-nowrap flex-shrink-0 ${
                tab === t
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white bg-gray-900/40'
              }`}
            >
              <span>{icon}</span>{label}
              {t === 'mine' && myCourses.length > 0 && (
                <span className="ml-1 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">{myCourses.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {displayed.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-bold text-lg text-gray-400 mb-1">
              {tab === 'mine' ? 'Not enrolled in any courses yet' : 'No courses available'}
            </h3>
            <p className="text-gray-600 text-sm">
              {tab === 'mine' ? 'Browse all courses and click Enroll to get started.' : 'Check back soon.'}
            </p>
            {tab === 'mine' && (
              <button onClick={() => setTab('all')} className="mt-4 btn-primary text-sm">Browse Courses</button>
            )}
          </div>
        )}

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {displayed.map(course => {
            const img = LEVEL_IMGS[course.level] || LEVEL_IMGS.beginner;
            return (
              <div key={course.id} className="card !p-0 overflow-hidden flex flex-col group hover:border-primary/50 transition-all">
                {/* Course image */}
                <div className="relative h-36 overflow-hidden flex-shrink-0">
                  <img src={img} alt={course.level} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <span className={`badge text-xs ${LEVEL_COLORS[course.level] || 'bg-gray-700 text-gray-300'}`}>
                      {LEVEL_ICONS[course.level] || '📘'} {course.level}
                    </span>
                    {course.is_ai_gen && <span className="badge bg-accent/20 text-accent border border-accent/30 text-xs">🤖 AI</span>}
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="text-accent font-black text-sm drop-shadow">+{course.points_reward} pts</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <h3 className="font-bold text-white leading-snug">{course.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1">{course.description}</p>

                  {/* Progress bar */}
                  {course.progress !== undefined && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Action */}
                  <div className="flex items-center justify-between pt-1 mt-auto">
                    {course.category && (
                      <span className="text-xs text-gray-500 capitalize">{course.category}</span>
                    )}
                    {enrolled.has(course.id) ? (
                      <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Enrolled
                      </span>
                    ) : (
                      <button
                        onClick={() => enroll(course.id)}
                        className="btn-primary text-xs py-1.5 px-4"
                      >
                        Enroll Free
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
