// import React from 'react';

// interface Props {
//   isComment: boolean;
//   handleCommentToggle: () => void;
// }

// export const CommentsModalView = ({
//   isComment,
//   handleCommentToggle,
// }: Props) => {
//   return (
//     <div className="max-w-xl mx-auto bg-white rounded-lg p-6 shadow-md flex flex-col gap-4">
//       <div className="flex justify-between items-start">
//         {/* Kullanıcı bilgisi */}
//         <div className="flex items-center gap-4">
//           <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-lg">
//             {/* Avatar placeholder */}А
//           </div>
//           <div>
//             <div className="font-semibold text-gray-800">Анастасия</div>
//             <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={3}
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//               Выкупили
//             </div>
//           </div>
//         </div>

//         {/* Sağ üst bilgi */}
//         <div className="flex flex-col items-end gap-1">
//           <div className="flex gap-0.5 text-yellow-400">
//             {[...Array(5)].map((_, i) => (
//               <svg
//                 key={i}
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.175 0l-3.39 2.462c-.784.57-1.838-.196-1.54-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
//               </svg>
//             ))}
//           </div>
//           <div className="text-gray-500 text-sm">Сегодня, 17:29</div>
//         </div>
//       </div>

//       {/* Yorum metni */}
//       <div>
//         <span className="font-semibold">Достоинства:</span>{' '}
//         <span>Довольна , уже заказала 3-ю</span>
//       </div>

//       {/* Üç nokta menü ikonu sağ alt */}
//       <div className="flex justify-end">
//         <button className="text-gray-400 hover:text-gray-600">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="currentColor"
//             viewBox="0 0 20 20"
//           >
//             <circle cx="3" cy="10" r="2" />
//             <circle cx="10" cy="10" r="2" />
//             <circle cx="17" cy="10" r="2" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };
