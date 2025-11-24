import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, BookOpen, CheckCircle2 } from 'lucide-react'

interface Section {
    id: string;
    title: string;
    content: React.ReactNode;
}

export default function WordOrderPage() {
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
            title: 'Trật tự từ trong câu tiếng Anh là gì?',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700">
                        <strong>Trật tự từ (word order)</strong> đơn giản là cách sắp xếp các từ trong câu tiếng Anh theo một thứ tự nào đó.
                        Các từ liên kết với nhau theo trật tự không chỉ thể hiện ý nghĩa về mặt từ vựng mà còn biểu thị chức năng ngữ pháp.
                    </p>
                    <div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded">
                        <p className="font-semibold text-brand-900">Cấu trúc cơ bản:</p>
                        <p className="text-lg font-mono text-brand-700 mt-2">S + V + O</p>
                        <p className="text-sm text-gray-600 mt-2">
                            S (Subject) - Chủ ngữ | V (Verb) - Động từ | O (Object) - Tân ngữ
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="font-semibold text-gray-900">Ví dụ:</p>
                        <ul className="space-y-2">
                            <li className="flex gap-2">
                                <span className="text-brand-600">•</span>
                                <span><strong className="text-blue-600">I</strong> <strong className="text-green-600">love</strong> <strong className="text-purple-600">you</strong>. (Tôi yêu bạn)</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-600">•</span>
                                <span><strong className="text-blue-600">I</strong> usually <strong className="text-green-600">get up</strong> <strong className="text-purple-600">at 7 am</strong>. (Tôi thường thức dậy lúc 7 giờ sáng)</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: 'importance',
            title: 'Tầm quan trọng của trật tự từ',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Trật tự từ trong câu tiếng Anh <strong>quyết định ý nghĩa của câu</strong>. Chỉ cần thay đổi vị trí của một từ,
                        nghĩa của câu có thể khác hoàn toàn.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="font-semibold text-yellow-900 mb-3">Ví dụ so sánh:</p>
                        <div className="space-y-3">
                            <div className="bg-white p-3 rounded">
                                <p className="font-mono text-gray-900">I <strong className="text-red-600">only</strong> like non-vegetarian dishes.</p>
                                <p className="text-sm text-gray-600 mt-1">→ Tôi chỉ thích các món mặn.</p>
                            </div>
                            <div className="bg-white p-3 rounded">
                                <p className="font-mono text-gray-900"><strong className="text-red-600">Only</strong> I like non-vegetarian dishes.</p>
                                <p className="text-sm text-gray-600 mt-1">→ Chỉ có tôi thích các món mặn.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'adjective-order',
            title: 'Quy tắc 1: Trật tự tính từ (OSASCOMP)',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700">Khi có nhiều tính từ trong câu, cần sắp xếp theo thứ tự OSASCOMP:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-purple-50 p-3 rounded">
                            <strong className="text-purple-700">O</strong>pinion - Ý kiến<br />
                            <span className="text-sm text-gray-600">good, beautiful, horrible...</span>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                            <strong className="text-blue-700">S</strong>ize - Kích cỡ<br />
                            <span className="text-sm text-gray-600">big, small, huge, tiny...</span>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                            <strong className="text-green-700">A</strong>ge - Tuổi tác<br />
                            <span className="text-sm text-gray-600">new, old, young, ancient...</span>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded">
                            <strong className="text-yellow-700">S</strong>hape - Hình dạng<br />
                            <span className="text-sm text-gray-600">round, square, circular...</span>
                        </div>
                        <div className="bg-red-50 p-3 rounded">
                            <strong className="text-red-700">C</strong>olour - Màu sắc<br />
                            <span className="text-sm text-gray-600">blue, red, green, silver...</span>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded">
                            <strong className="text-indigo-700">O</strong>rigin - Xuất xứ<br />
                            <span className="text-sm text-gray-600">Vietnamese, American...</span>
                        </div>
                        <div className="bg-pink-50 p-3 rounded">
                            <strong className="text-pink-700">M</strong>aterial - Chất liệu<br />
                            <span className="text-sm text-gray-600">silk, wooden, plastic...</span>
                        </div>
                        <div className="bg-orange-50 p-3 rounded">
                            <strong className="text-orange-700">P</strong>urpose - Công dụng<br />
                            <span className="text-sm text-gray-600">sleeping (bag), hunting (dog)...</span>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-brand-500">
                        <p className="font-semibold mb-2">Ví dụ:</p>
                        <p className="font-mono">A <span className="text-purple-600">beautiful</span> <span className="text-blue-600">long</span> <span className="text-red-600">green</span> evening-gown</p>
                        <p className="text-sm text-gray-600 mt-1">(Một chiếc váy dạ hội dài màu xanh lá cây xinh đẹp)</p>
                    </div>
                </div>
            )
        },
        {
            id: 'adverb-position',
            title: 'Quy tắc 2: Vị trí trạng từ',
            content: (
                <div className="space-y-4">
                    <div className="space-y-3">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-blue-900">Trạng từ chỉ cách thức (Manner)</h4>
                            <p className="text-sm text-gray-600 mt-1">Đứng sau động từ chính hoặc tân ngữ</p>
                            <p className="mt-2 font-mono text-sm">She sings <strong className="text-blue-600">beautifully</strong>.</p>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                            <h4 className="font-semibold text-green-900">Trạng từ chỉ tần suất (Frequency)</h4>
                            <p className="text-sm text-gray-600 mt-1">Đứng trước động từ chính, sau trợ động từ</p>
                            <p className="mt-2 font-mono text-sm">I <strong className="text-green-600">always</strong> wake up early.</p>
                            <p className="mt-1 font-mono text-sm">He is <strong className="text-green-600">usually</strong> late.</p>
                        </div>

                        <div className="border-l-4 border-purple-500 pl-4">
                            <h4 className="font-semibold text-purple-900">Trạng từ chỉ nơi chốn (Place)</h4>
                            <p className="text-sm text-gray-600 mt-1">Đứng sau động từ chính hoặc cuối mệnh đề</p>
                            <p className="mt-2 font-mono text-sm">He ran <strong className="text-purple-600">outside</strong>.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'sentence-types',
            title: 'Quy tắc 3-6: Các loại câu',
            content: (
                <div className="space-y-4">
                    <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">1. Câu trần thuật (Declarative)</h4>
                            <p className="text-sm text-gray-600 mb-3">Cấu trúc: S + V + O</p>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="font-mono">Daniel is running.</p>
                                <p className="font-mono mt-1">She has drunk two cups of coffee.</p>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">2. Câu nghi vấn (Interrogative)</h4>
                            <p className="text-sm text-gray-600 mb-3">Cấu trúc: Auxiliary + S + V?</p>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="font-mono"><strong className="text-brand-600">Do</strong> you like coffee?</p>
                                <p className="font-mono mt-1"><strong className="text-brand-600">When does</strong> the movie start?</p>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">3. Câu mệnh lệnh (Imperative)</h4>
                            <p className="text-sm text-gray-600 mb-3">Cấu trúc: V (bare infinitive)</p>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="font-mono">Open the door!</p>
                                <p className="font-mono mt-1">Don't move!</p>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">4. Câu cảm thán (Exclamative)</h4>
                            <p className="text-sm text-gray-600 mb-3">Cấu trúc: What/How + ...</p>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="font-mono">What a beautiful day!</p>
                                <p className="font-mono mt-1">How beautiful it is!</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'emphasis',
            title: 'Quy tắc 7: Nhấn mạnh trong câu',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700">Thay đổi trật tự từ để nhấn mạnh phần quan trọng:</p>
                    <div className="space-y-3">
                        <div className="bg-gray-50 p-4 rounded">
                            <p className="text-sm text-gray-500 mb-1">Thông thường:</p>
                            <p className="font-mono">The acting was great but the soundtrack was even better.</p>
                        </div>
                        <div className="bg-brand-50 p-4 rounded border-l-4 border-brand-500">
                            <p className="text-sm text-brand-600 mb-1">Nhấn mạnh (fronting):</p>
                            <p className="font-mono">The acting was great but <strong className="text-brand-700">even better than that was the soundtrack</strong>.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'tips',
            title: '3 cách học trật tự từ hiệu quả',
            content: (
                <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                        <div className="bg-brand-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="font-bold text-brand-700">1</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">Nghe và đọc thật nhiều</h4>
                            <p className="text-gray-600 text-sm mt-1">
                                Tiếp xúc tự nhiên với cách người bản ngữ nói và viết. Xem phim, nghe podcast, đọc sách để quen với cấu trúc câu.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-start">
                        <div className="bg-brand-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="font-bold text-brand-700">2</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">Luyện viết và dùng màu để ghi nhớ</h4>
                            <p className="text-gray-600 text-sm mt-1">
                                Tô màu các thành phần khác nhau: động từ màu hồng, danh từ màu xanh...
                                Giúp bạn dễ hình dung và ghi nhớ cấu trúc.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-start">
                        <div className="bg-brand-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="font-bold text-brand-700">3</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">Kiên nhẫn và luyện tập thường xuyên</h4>
                            <p className="text-gray-600 text-sm mt-1">
                                Không có "mẹo thần tốc". Quan trọng là kiên trì và thực hành đều đặn.
                                Càng luyện tập nhiều, bạn sẽ càng cảm thấy tự nhiên hơn.
                            </p>
                        </div>
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
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Trật tự từ trong câu</h1>
                        <p className="text-gray-500">Word Order in English Sentences</p>
                    </div>
                </div>
                <p className="text-gray-600">
                    Nắm vững 17 quy tắc trật tự từ trong tiếng Anh giúp bạn viết câu đúng ngữ pháp,
                    tránh hiểu lầm và giao tiếp hiệu quả hơn.
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

            {/* Summary Box */}
            <div className="mt-8 bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl p-6 border-2 border-brand-200">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-brand-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Tóm lại</h3>
                        <p className="text-gray-700 text-sm">
                            Trật tự từ trong tiếng Anh quan trọng vì nó quyết định nghĩa của câu.
                            Hãy nhớ cấu trúc cơ bản <strong>S + V + O</strong>, quy tắc <strong>OSASCOMP</strong> cho tính từ,
                            và các vị trí đặc biệt của trạng từ. Luyện tập thường xuyên để câu của bạn ngày càng tự nhiên!
                        </p>
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
