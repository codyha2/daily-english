import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, FileText, AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react'

interface Section {
    id: string;
    title: string;
    content: React.ReactNode;
}

export default function ArticlesPage() {
    const [openSections, setOpenSections] = useState<Set<string>>(new Set(['intro']))

    const toggleSection = (id: string) => {
        const newOpenSections = new Set(openSections)
        if (newOpenSections.has(id)) {
            newOpenSections.delete(id)
        } else {
            newOpenSections.add(id)
        }
        setOpenSections(newOpenSections)
    }

    const sections: Section[] = [
        {
            id: 'intro',
            title: 'Mạo từ là gì?',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Mạo từ trong tiếng Anh là các từ đứng trước danh từ hoặc cụm danh từ, có tác dụng nhận biết
                        đó là đối tượng xác định hoặc không xác định.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                            <h4 className="font-semibold text-blue-900 mb-2">Mạo từ xác định</h4>
                            <p className="text-3xl font-bold text-blue-600 mb-2">THE</p>
                            <p className="text-sm text-gray-600">
                                Dùng cho danh từ đã được xác định, người nói và người nghe đều biết đối tượng cụ thể.
                            </p>
                        </div>
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <h4 className="font-semibold text-green-900 mb-2">Mạo từ không xác định</h4>
                            <p className="text-3xl font-bold text-green-600 mb-2">A / AN</p>
                            <p className="text-sm text-gray-600">
                                Dùng cho danh từ chung chung,  chưa xác định. Chỉ dùng với danh từ đếm được số ít.
                            </p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'the-usage',
            title: 'Cách dùng mạo từ "The"',
            content: (
                <div className="space-y-4">
                    <div className="space-y-3">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-brand-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-brand-700">1</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">Danh từ duy nhất</h4>
                                    <p className="text-sm text-gray-600 mt-1">Dùng trước danh từ được cho là duy nhất</p>
                                    <div className="mt-2 bg-gray-50 p-3 rounded">
                                        <p className="font-mono text-sm"><strong className="text-brand-600">The sun</strong> rises in the east.</p>
                                        <p className="font-mono text-sm mt-1"><strong className="text-brand-600">The moon</strong>, <strong className="text-brand-600">the world</strong>, <strong className="text-brand-600">the sea</strong></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-brand-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-brand-700">2</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">Danh từ đã đề cập</h4>
                                    <p className="text-sm text-gray-600 mt-1">Dùng với danh từ vừa được nhắc đến trước đó</p>
                                    <div className="mt-2 bg-gray-50 p-3 rounded">
                                        <p className="font-mono text-sm">I met <strong className="text-green-600">a girl</strong>. <strong className="text-brand-600">The girl</strong> wore a beautiful dress.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-brand-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-brand-700">3</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">So sánh nhất</h4>
                                    <p className="text-sm text-gray-600 mt-1">Dùng với first, second, only, hình thức so sánh nhất</p>
                                    <div className="mt-2 bg-gray-50 p-3 rounded">
                                        <p className="font-mono text-sm">He's <strong className="text-brand-600">the tallest</strong> person.</p>
                                        <p className="font-mono text-sm mt-1"><strong className="text-brand-600">The first</strong> opinion, <strong className="text-brand-600">the only</strong> case</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-brand-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-brand-700">4</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">Nhạc cụ</h4>
                                    <p className="text-sm text-gray-600 mt-1">Dùng trước tên nhạc cụ</p>
                                    <div className="mt-2 bg-gray-50 p-3 rounded">
                                        <p className="font-mono text-sm"><strong className="text-brand-600">The piano</strong>, <strong className="text-brand-600">the guitar</strong>, <strong className="text-brand-600">the violin</strong></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-brand-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-brand-700">5</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">Địa điểm công cộng</h4>
                                    <p className="text-sm text-gray-600 mt-1">Dùng với library, mall, supermarket...</p>
                                    <div className="mt-2 bg-gray-50 p-3 rounded">
                                        <p className="font-mono text-sm">She's at <strong className="text-brand-600">the library</strong>.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'a-an-usage',
            title: 'Cách dùng mạo từ "A" và "An"',
            content: (
                <div className="space-y-4">
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                        <div className="flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-yellow-900">Quy tắc phân biệt A và An</p>
                                <p className="text-sm text-yellow-700 mt-1">
                                    Dựa vào <strong>cách phát âm</strong>, không phải chữ cái đầu tiên!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-3 text-lg">Dùng "A"</h4>
                            <p className="text-sm text-gray-600 mb-3">Trước từ bắt đầu bằng <strong>phụ âm</strong></p>
                            <div className="space-y-2">
                                <div className="bg-blue-50 p-2 rounded">
                                    <p className="font-mono text-sm"><strong className="text-blue-600">A</strong> cat, <strong className="text-blue-600">A</strong> dog</p>
                                </div>
                                <div className="bg-blue-50 p-2 rounded">
                                    <p className="font-mono text-sm"><strong className="text-blue-600">A university</strong> /juː-ni-ver-si-ti/ (âm /j/)</p>
                                </div>
                                <div className="bg-blue-50 p-2 rounded">
                                    <p className="font-mono text-sm"><strong className="text-blue-600">A European</strong> /jʊə-rə-piː-ən/ (âm /j/)</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 mb-3 text-lg">Dùng "An"</h4>
                            <p className="text-sm text-gray-600 mb-3">Trước từ bắt đầu bằng <strong>nguyên âm</strong> (a, e, i, o, u)</p>
                            <div className="space-y-2">
                                <div className="bg-green-50 p-2 rounded">
                                    <p className="font-mono text-sm"><strong className="text-green-600">An</strong> apple, <strong className="text-green-600">An</strong> egg</p>
                                </div>
                                <div className="bg-green-50 p-2 rounded">
                                    <p className="font-mono text-sm"><strong className="text-green-600">An umbrella</strong> /ʌm-brel-ə/ (âm /ʌ/)</p>
                                </div>
                                <div className="bg-green-50 p-2 rounded">
                                    <p className="font-mono text-sm"><strong className="text-green-600">An hour</strong> /aʊər/ (h câm)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'no-article',
            title: 'Khi KHÔNG dùng mạo từ',
            content: (
                <div className="space-y-3">
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-red-900">Trước danh từ số nhiều hoặc không đếm được</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                ✓ Cats are cute. | ✗ A cats are cute.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-red-900">Trước tên bữa ăn (trừ khi có tính từ)</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                ✓ I have lunch at 12. | ✗ I have a lunch.<br />
                                Nhưng: I have a delicious lunch.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-red-900">Trước tên ngôn ngữ, quốc gia, tiểu bang</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                ✓ I speak English. | ✗ I speak the English.<br />
                                ✓ He lives in Korea. | ✗ He lives in the Korea.<br />
                                <span className="text-xs">(Ngoại trừ: The United States, The Philippines...)</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-red-900">Sau tính từ/danh từ sở hữu</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                ✓ He is my friend. | ✗ He is a my friend.
                            </p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'common-mistakes',
            title: 'Lỗi thường gặp',
            content: (
                <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2">❌ Lỗi 1: Nhầm A và An</h4>
                        <div className="space-y-2">
                            <p className="text-sm"><span className="text-red-600">✗</span> a umbrella → <span className="text-green-600">✓</span> an umbrella</p>
                            <p className="text-sm"><span className="text-red-600">✗</span> an university → <span className="text-green-600">✓</span> a university</p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2">❌ Lỗi 2: Quên mạo từ với tính từ + danh từ</h4>
                        <div className="space-y-2">
                            <p className="text-sm"><span className="text-red-600">✗</span> beautiful landscape → <span className="text-green-600">✓</span> a beautiful landscape</p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2">❌ Lỗi 3: Quên "The" với địa điểm công cộng</h4>
                        <div className="space-y-2">
                            <p className="text-sm"><span className="text-red-600">✗</span> She's at library. → <span className="text-green-600">✓</span> She's at the library.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'exercises',
            title: 'Bài tập thực hành',
            content: (
                <div className="space-y-4">
                    <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                        <h4 className="font-semibold text-brand-900 mb-3">Bài 1: Điền A, An hoặc The</h4>
                        <div className="space-y-2">
                            <p className="text-sm">1. I bought _____ umbrella to go out in the rain.</p>
                            <p className="text-sm">2. _____ sun rises in the east.</p>
                            <p className="text-sm">3. She is _____ nice girl.</p>
                            <p className="text-sm">4. He plays _____ piano very well.</p>
                            <p className="text-sm">5. I have _____ dog and _____ cat.</p>
                        </div>
                        <details className="mt-4">
                            <summary className="cursor-pointer text-brand-700 font-semibold">Xem đáp án</summary>
                            <div className="mt-2 space-y-1 text-sm bg-white p-3 rounded">
                                <p>1. an</p>
                                <p>2. The</p>
                                <p>3. a</p>
                                <p>4. the</p>
                                <p>5. a / a</p>
                            </div>
                        </details>
                    </div>

                    <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                        <h4 className="font-semibold text-brand-900 mb-3">Bài 2: Chọn đáp án đúng</h4>
                        <div className="space-y-2">
                            <p className="text-sm">1. Is he going to (a / an / the) event next Monday?</p>
                            <p className="text-sm">2. I watched (a / an / the) horror film you sent me.</p>
                            <p className="text-sm">3. Do you want to go to (a / an / the) library?</p>
                        </div>
                        <details className="mt-4">
                            <summary className="cursor-pointer text-brand-700 font-semibold">Xem đáp án</summary>
                            <div className="mt-2 space-y-1 text-sm bg-white p-3 rounded">
                                <p>1. the</p>
                                <p>2. the</p>
                                <p>3. the</p>
                            </div>
                        </details>
                    </div>
                </div>
            )
        }
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mạo từ A, An, The</h1>
                        <p className="text-gray-500">Articles in English Grammar</p>
                    </div>
                </div>
                <p className="text-gray-600">
                    Mạo từ là các từ đứng trước danh từ để xác định đối tượng là đã biết hay chưa biết.
                    Học đúng cách dùng mạo từ giúp câu văn rõ ràng và chính xác hơn.
                </p>
            </div>

            {/* Sections */}
            <div className="space-y-3">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                            {openSections.has(section.id) ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatedContent isOpen={openSections.has(section.id)}>
                            <div className="px-6 pb-6 pt-2">
                                {section.content}
                            </div>
                        </AnimatedContent>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Tóm lại</h3>
                        <ul className="text-gray-700 text-sm space-y-1">
                            <li>• <strong>A/An</strong>: Danh từ chưa xác định, số ít, đếm được</li>
                            <li>• <strong>The</strong>: Danh từ đã xác định, cả người nói và người nghe đều biết</li>
                            <li>• Phân biệt A/An dựa vào <strong>cách phát âm</strong>, không phải chữ cái</li>
                            <li>• Luyện tập thường xuyên để sử dụng mạo từ chính xác!</li>
                        </ul>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function AnimatedContent({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
    return (
        <motion.div
            initial={false}
            animate={{
                height: isOpen ? 'auto' : 0,
                opacity: isOpen ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
        >
            {children}
        </motion.div>
    )
}
