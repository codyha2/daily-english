export interface Tense {
    id: string;
    name: string;
    nameVi: string;
    category: 'present' | 'past' | 'future';
    type: 'simple' | 'continuous' | 'perfect' | 'perfect-continuous';
    color: string;
    definition: string;
    definitionVi: string;

    formulas: {
        affirmative: {
            regular: string;
            toBe?: string;
        };
        negative: {
            regular: string;
            toBe?: string;
        };
        interrogative: {
            regular: string;
            toBe?: string;
        };
        wh_question: {
            regular: string;
            toBe?: string;
        };
    };

    usages: {
        title: string;
        description: string;
        example: {
            en: string;
            vi: string;
        };
    }[];

    timeMarkers: string[];

    examples: {
        type: 'affirmative' | 'negative' | 'interrogative' | 'wh_question';
        en: string;
        vi: string;
    }[];
}

export const tensesData: Tense[] = [
    {
        id: 'present-simple',
        name: 'Present Simple',
        nameVi: 'Thì hiện tại đơn',
        category: 'present',
        type: 'simple',
        color: '#6366F1',
        definition: 'The present simple tense is used to describe habits, general truths, and regular actions.',
        definitionVi: 'Thì hiện tại đơn được dùng để diễn tả những hành động, đặc điểm và thói quen đang diễn ra trong hiện tại.',

        formulas: {
            affirmative: {
                regular: 'S + V1(+s/es) + O',
                toBe: 'S + am/is/are + O'
            },
            negative: {
                regular: 'S + do not/does not + V_inf + O',
                toBe: 'S + am not/is not/are not + O'
            },
            interrogative: {
                regular: 'Do/Does + S + V_inf?',
                toBe: 'Am/Is/Are + S + complement?'
            },
            wh_question: {
                regular: 'Từ hỏi + do/does + S + V_inf?',
                toBe: 'Từ hỏi + am/are/is + S?'
            }
        },

        usages: [
            {
                title: 'Diễn tả những hiện tượng, quy luật chung khó có thể thay đổi',
                description: 'Dùng để nói về chân lý, sự thật hiển nhiên',
                example: {
                    en: 'The Earth revolves around the Sun.',
                    vi: 'Trái đất quay quanh Mặt trời.'
                }
            },
            {
                title: 'Diễn tả những thói quen, sở thích hoặc quan điểm',
                description: 'Hành động lặp đi lặp lại thường xuyên',
                example: {
                    en: 'I play football every day.',
                    vi: 'Tôi chơi bóng đá mỗi ngày.'
                }
            },
            {
                title: 'Diễn tả những hành động cảm nhận bằng giác quan trong thời điểm nói',
                description: 'Sử dụng với các động từ chỉ cảm giác',
                example: {
                    en: 'She looks very happy.',
                    vi: 'Cô ấy trông rất vui.'
                }
            },
            {
                title: 'Diễn tả lịch trình đã được định sẵn',
                description: 'Các sự kiện theo lịch trình cố định',
                example: {
                    en: 'The train leaves at 6 PM.',
                    vi: 'Tàu khởi hành lúc 6 giờ chiều.'
                }
            }
        ],

        timeMarkers: [
            'always', 'usually', 'often', 'frequently', 'sometimes',
            'occasionally', 'seldom', 'rarely', 'never',
            'every day/week/month/year', 'once a week', 'twice a month'
        ],

        examples: [
            {
                type: 'affirmative',
                en: 'I play football every day.',
                vi: 'Tôi chơi bóng đá mỗi ngày.'
            },
            {
                type: 'affirmative',
                en: 'She is a teacher.',
                vi: 'Cô ấy là giáo viên.'
            },
            {
                type: 'negative',
                en: 'I do not like coffee.',
                vi: 'Tôi không thích cà phê.'
            },
            {
                type: 'negative',
                en: 'He is not happy.',
                vi: 'Anh ấy không vui.'
            },
            {
                type: 'interrogative',
                en: 'Do you like pizza?',
                vi: 'Bạn có thích pizza không?'
            },
            {
                type: 'interrogative',
                en: 'Is she your friend?',
                vi: 'Cô ấy có phải bạn của bạn không?'
            },
            {
                type: 'wh_question',
                en: 'What do you do in your free time?',
                vi: 'Bạn làm gì vào thời gian rảnh?'
            },
            {
                type: 'wh_question',
                en: 'Where is he?',
                vi: 'Anh ấy ở đâu?'
            }
        ]
    },

    {
        id: 'present-continuous',
        name: 'Present Continuous',
        nameVi: 'Thì hiện tại tiếp diễn',
        category: 'present',
        type: 'continuous',
        color: '#8B5CF6',
        definition: 'The present continuous tense is used to describe actions happening now or around now.',
        definitionVi: 'Thì hiện tại tiếp diễn được dùng để diễn tả hành động đang xảy ra tại thời điểm nói.',

        formulas: {
            affirmative: {
                regular: 'S + am/is/are + V-ing'
            },
            negative: {
                regular: 'S + am/is/are not + V-ing'
            },
            interrogative: {
                regular: 'Am/Is/Are + S + V-ing?'
            },
            wh_question: {
                regular: 'Từ hỏi + am/is/are + S + V-ing?'
            }
        },

        usages: [
            {
                title: 'Diễn tả hành động đang diễn ra ngay tại thời điểm nói',
                description: 'Hành động đang xảy ra ở hiện tại',
                example: {
                    en: 'She walks to school every day.',
                    vi: 'Cô ấy đi bộ đến trường mỗi ngày.'
                }
            },
            {
                title: 'Diễn tả hành động sẽ xảy ra trong tương lai gần, thường là một dự định hay kế hoạch đã được sắp xếp từ trước',
                description: 'Kế hoạch trong tương lai gần',
                example: {
                    en: 'I am meeting him tomorrow.',
                    vi: 'Tôi sẽ gặp anh ấy vào ngày mai.'
                }
            },
            {
                title: 'Diễn tả hành động xảy ra ở hiện tại nhưng chỉ mang tính chất tạm thời, khác với quy luật hay thói quen thông thường',
                description: 'Tình huống tạm thời',
                example: {
                    en: 'She is staying in London this week.',
                    vi: 'Tuần này cô ấy đang ở London.'
                }
            },
            {
                title: 'Diễn tả những chuyển biến, thay đổi ở hiện tại, thường đi kém với các động từ',
                description: 'Sự thay đổi đang diễn ra với: get, change, become, grow, increase, improve, rise, fall...',
                example: {
                    en: 'The climate is changing rapidly.',
                    vi: 'Khí hậu đang thay đổi nhanh chóng.'
                }
            },
            {
                title: 'Diễn tả hành động lặp đi lặp lại gây bực mình hay khó chịu cho người nói khi dùng với các trạng từ',
                description: 'Phàn nàn với: always, continually, constantly...',
                example: {
                    en: 'He is always complaining about the weather.',
                    vi: 'Anh ấy luôn phàn nàn về thời tiết.'
                }
            }
        ],

        timeMarkers: [
            'now', 'right now', 'at the moment', 'at present',
            'at + giờ cụ thể',
            'Look!', 'Listen!', 'Keep silent!', 'Be quiet!',
            'tomorrow', 'this week/month/year', 'next week/month/year'
        ],

        examples: [
            {
                type: 'affirmative',
                en: 'She walks to school every day.',
                vi: 'Cô ấy đi bộ đến trường mỗi ngày.'
            },
            {
                type: 'negative',
                en: 'He does not like chocolate.',
                vi: 'Anh ấy không thích sô cô la.'
            },
            {
                type: 'interrogative',
                en: 'Do they play football?',
                vi: 'Họ có chơi bóng đá không?'
            },
            {
                type: 'wh_question',
                en: 'What does he eat for breakfast?',
                vi: 'Anh ấy ăn gì vào bữa sáng?'
            }
        ]
    },

    // Present Perfect
    {
        id: 'present-perfect',
        name: 'Present Perfect',
        nameVi: 'Thì hiện tại hoàn thành',
        category: 'present',
        type: 'perfect',
        color: '#A78BFA',
        definition: 'The present perfect tense is used to describe actions that happened at an unspecified time or have relevance to the present.',
        definitionVi: 'Thì hiện tại hoàn thành được dùng để diễn tả hành động đã xảy ra hoặc chưa xảy ra nhưng có liên quan đến hiện tại.',

        formulas: {
            affirmative: {
                regular: 'S + have/has + V3/V-ed'
            },
            negative: {
                regular: 'S + have/has + not + V3/V-ed'
            },
            interrogative: {
                regular: 'Have/Has + S + V3/V-ed?'
            },
            wh_question: {
                regular: 'Từ hỏi + have/has + S + V3/V-ed?'
            }
        },

        usages: [
            {
                title: 'Diễn tả hành động đã xảy ra và hoàn thành ở một thời điểm không xác định trong quá khứ',
                description: 'Không nói rõ thời gian cụ thể',
                example: {
                    en: 'I have visited London.',
                    vi: 'Tôi đã đến thăm London.'
                }
            },
            {
                title: 'Diễn tả hành động bắt đầu ở quá khứ và vẫn tiếp tục đến hiện tại',
                description: 'Hành động kéo dài từ quá khứ đến hiện tại',
                example: {
                    en: 'I have lived here for 5 years.',
                    vi: 'Tôi đã sống ở đây được 5 năm.'
                }
            },
            {
                title: 'Diễn tả kinh nghiệm, trải nghiệm đến thời điểm hiện tại',
                description: 'Những việc đã trải qua',
                example: {
                    en: 'She has never eaten sushi.',
                    vi: 'Cô ấy chưa bao giờ ăn sushi.'
                }
            }
        ],

        timeMarkers: [
            'already', 'just', 'recently', 'lately', 'ever', 'never',
            'yet', 'so far', 'up to now', 'up to present',
            'since', 'for', 'this week/month/year',
            'several times', 'many times', 'before'
        ],

        examples: [
            {
                type: 'affirmative',
                en: 'I have finished my homework.',
                vi: 'Tôi đã hoàn thành bài tập về nhà.'
            },
            {
                type: 'affirmative',
                en: 'She has lived here for 10 years.',
                vi: 'Cô ấy đã sống ở đây được 10 năm.'
            },
            {
                type: 'negative',
                en: 'I have not seen him today.',
                vi: 'Tôi chưa gặp anh ấy hôm nay.'
            },
            {
                type: 'interrogative',
                en: 'Have you ever been to Paris?',
                vi: 'Bạn đã từng đến Paris chưa?'
            },
            {
                type: 'wh_question',
                en: 'How long have you worked here?',
                vi: 'Bạn đã làm việc ở đây được bao lâu?'
            }
        ]
    },

    // Present Perfect Continuous
    {
        id: 'present-perfect-continuous',
        name: 'Present Perfect Continuous',
        nameVi: 'Thì hiện tại hoàn thành tiếp diễn',
        category: 'present',
        type: 'perfect-continuous',
        color: '#C084FC',
        definition: 'The present perfect continuous tense emphasizes the duration of an action that started in the past and continues to the present.',
        definitionVi: 'Thì hiện tại hoàn thành tiếp diễn nhấn mạnh tính liên tục của hành động bắt đầu từ quá khứ và vẫn tiếp tục đến hiện tại.',

        formulas: {
            affirmative: {
                regular: 'S + have/has + been + V-ing'
            },
            negative: {
                regular: 'S + have/has + not + been + V-ing'
            },
            interrogative: {
                regular: 'Have/Has + S + been + V-ing?'
            },
            wh_question: {
                regular: 'Từ hỏi + have/has + S + been + V-ing?'
            }
        },

        usages: [
            {
                title: 'Diễn tả hành động bắt đầu từ quá khứ và vẫn đang tiếp diễn tại thời điểm hiện tại',
                description: 'Nhấn mạnh tính liên tục của hành động',
                example: {
                    en: 'I have been studying English for 3 hours.',
                    vi: 'Tôi đã học tiếng Anh được 3 giờ.'
                }
            },
            {
                title: 'Diễn tả hành động  vừa kết thúc để lại kết quả hoặc hậu quả tại thời điểm nói',
                description: 'Có kết quả nhìn thấy được',
                example: {
                    en: 'It has been raining. The ground is wet.',
                    vi: 'Trời vừa mới mưa. Đất ướt.'
                }
            }
        ],

        timeMarkers: [
            'for + khoảng thời gian',
            'since + mốc thời gian',
            'all day/week/month',
            'how long...?'
        ],

        examples: [
            {
                type: 'affirmative',
                en: 'I have been waiting for you for 2 hours.',
                vi: 'Tôi đã đợi bạn được 2 giờ.'
            },
            {
                type: 'negative',
                en: 'She has not been feeling well lately.',
                vi: 'Gần đây cô ấy không được khỏe.'
            },
            {
                type: 'interrogative',
                en: 'Have you been working all day?',
                vi: 'Bạn đã làm việc cả ngày à?'
            },
            {
                type: 'wh_question',
                en: 'How long have you been learning English?',
                vi: 'Bạn đã học tiếng Anh được bao lâu rồi?'
            }
        ]
    },

    // Past Simple
    {
        id: 'past-simple',
        name: 'Past Simple',
        nameVi: 'Thì quá khứ đơn',
        category: 'past',
        type: 'simple',
        color: '#1E40AF',
        definition: 'The past simple tense is used to describe completed actions in the past.',
        definitionVi: 'Thì quá khứ đơn được dùng để diễn tả hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ.',

        formulas: {
            affirmative: {
                regular: 'S + V2/V-ed',
                toBe: 'S + was/were'
            },
            negative: {
                regular: 'S + did not + V_inf',
                toBe: 'S + was not/were not'
            },
            interrogative: {
                regular: 'Did + S + V_inf?',
                toBe: 'Was/Were + S...?'
            },
            wh_question: {
                regular: 'Từ hỏi + did + S + V_inf?',
                toBe: 'Từ hỏi + was/were + S?'
            }
        },

        usages: [
            {
                title: 'Diễn tả hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ',
                description: 'Hành động đã hoàn thành',
                example: {
                    en: 'I visited my grandparents yesterday.',
                    vi: 'Tôi đã đến thăm ông bà của tôi ngày hôm qua.'
                }
            },
            {
                title: 'Diễn tả các hành động xảy ra liên tiếp trong quá khứ',
                description: 'Chuỗi hành động trong quá khứ',
                example: {
                    en: 'She came home, opened the door and turned on the light.',
                    vi: 'Cô ấy về nhà, mở cửa và bật đèn.'
                }
            },
            {
                title: 'Diễn tả thói quen trong quá khứ',
                description: 'Thói quen đã kết thúc',
                example: {
                    en: 'When I was young, I played football every day.',
                    vi: 'Khi tôi còn trẻ, tôi chơi bóng đá mỗi ngày.'
                }
            }
        ],

        timeMarkers: [
            'yesterday', 'last night/week/month/year',
            'ago (2 days ago, 3 weeks ago)', 'in + năm trong quá khứ',
            'when', 'in the past', 'once upon a time',
            'used to', 'did not use to'
        ],

        examples: [
            {
                type: 'affirmative',
                en: 'I went to school yesterday.',
                vi: 'Tôi đã đi học ngày hôm qua.'
            },
            {
                type: 'affirmative',
                en: 'She was happy.',
                vi: 'Cô ấy đã vui.'
            },
            {
                type: 'negative',
                en: 'I did not see him yesterday.',
                vi: 'Tôi không gặp anh ấy ngày hôm qua.'
            },
            {
                type: 'interrogative',
                en: 'Did you finish your homework?',
                vi: 'Bạn đã hoàn thành bài tập chưa?'
            },
            {
                type: 'wh_question',
                en: 'Where did you go last night?',
                vi: 'Tối qua bạn đã đi đâu?'
            }
        ]
    },

    // Past Continuous
    {
        id: 'past-continuous',
        name: 'Past Continuous',
        nameVi: 'Thì quá khứ tiếp diễn',
        category: 'past',
        type: 'continuous',
        color: '#1D4ED8',
        definition: 'The past continuous tense is used to describe actions that were in progress at a specific time in the past.',
        definitionVi: 'Thì quá khứ tiếp diễn được dùng để diễn tả hành động đang xảy ra tại một thời điểm cụ thể trong quá khứ.',

        formulas: {
            affirmative: {
                regular: 'S + was/were + V-ing'
            },
            negative: {
                regular: 'S + was/were + not + V-ing'
            },
            interrogative: {
                regular: 'Was/Were + S + V-ing?'
            },
            wh_question: {
                regular: 'Từ hỏi + was/were + S + V-ing?'
            }
        },

        usages: [
            {
                title: 'Diễn tả hành động đang xảy ra tại một thời điểm xác định trong quá khứ',
                description: 'Hành động đang diễn ra trong quá khứ',
                example: {
                    en: 'I was studying at 8 PM yesterday.',
                    vi: 'Tôi đang học lúc 8 giờ tối hôm qua.'
                }
            },
            {
                title: 'Diễn tả hai hành động xảy ra song song trong quá khứ',
                description: 'Hai hành động cùng diễn ra',
                example: {
                    en: 'While I was cooking, she was watching TV.',
                    vi: 'Trong khi tôi nấu ăn, cô ấy xem ti vi.'
                }
            },
            {
                title: 'Diễn tả hành động đang xảy ra thì có hành động khác xen vào',
                description: 'Hành động đang diễn ra bị gián đoạn',
                example: {
                    en: 'I was reading when the phone rang.',
                    vi: 'Tôi đang đọc sách thì điện thoại reo.'
                }
            }
        ],

        timeMarkers: [
            'at + giờ + thời gian trong quá khứ',
            'at this time yesterday',
            'at that time/moment',
            'when', 'while', 'as'
        ],

        examples: [
            {
                type: 'affirmative',
                en: 'She was cooking dinner at 7 PM.',
                vi: 'Cô ấy đang nấu bữa tối lúc 7 giờ tối.'
            },
            {
                type: 'negative',
                en: 'They were not playing football yesterday.',
                vi: 'Họ không chơi bóng đá ngày hôm qua.'
            },
            {
                type: 'interrogative',
                en: 'Were you sleeping when I called?',
                vi: 'Bạn có đang ngủ khi tôi gọi không?'
            },
            {
                type: 'wh_question',
                en: 'What were you doing at 9 AM?',
                vi: 'Bạn đang làm gì lúc 9 giờ sáng?'
            }
        ]
    },

    // Past Perfect
    {
        id: 'past-perfect',
        name: 'Past Perfect',
        nameVi: 'Thì quá khứ hoàn thành',
        category: 'past',
        type: 'perfect',
        color: '#2563EB',
        definition: 'The past perfect tense is used to describe an action that was completed before another action in the past.',
        definitionVi: 'Thì quá khứ hoàn thành được dùng để diễn tả một hành động xảy ra trước một hành động khác trong quá khứ.',

        formulas: {
            affirmative: {
                regular: 'S + had + V3/V-ed'
            },
            negative: {
                regular: 'S + had + not + V3/V-ed'
            },
            interrogative: {
                regular: 'Had + S + V3/V-ed?'
            },
            wh_question: {
                regular: 'Từ hỏi + had + S + V3/V-ed?'
            }
        },

        usages: [
            {
                title: 'Diễn tả hành động đã hoàn thành trước một thời điểm trong quá khứ',
                description: 'Hành động trước một mốc thời gian',
                example: {
                    en: 'I had finished my work by 5 PM yesterday.',
                    vi: 'Tôi đã hoàn thành công việc trước 5 giờ chiều hôm qua.'
                }
            },
            {
                title: 'Diễn tả hành động đã xảy ra và hoàn thành trước một hành động khác trong quá khứ',
                description: 'Hành động xảy ra trước hành động khác',
                example: {
                    en: 'When I arrived, the train had already left.',
                    vi: 'Khi tôi đến, tàu đã rời đi rồi.'
                }
            }
        ],

        timeMarkers: [
            'before', 'after', 'when', 'by the time',
            'as soon as', 'until', 'by + thời gian',
            'prior to + thời gian/sự kiện', 'already', 'just'
        ],

        examples: [
            {
                type: 'affirmative',
                en: 'She had left before I arrived.',
                vi: 'Cô ấy đã đi trước khi tôi đến.'
            },
            {
                type: 'negative',
                en: 'I had not seen him before that day.',
                vi: 'Tôi chưa gặp anh ấy trước ngày hôm đó.'
            },
            {
                type: 'interrogative',
                en: 'Had you finished dinner when I called?',
                vi: 'Bạn đã ăn tối xong khi tôi gọi chưa?'
            },
            {
                type: 'wh_question',
                en: 'What had you done before you came here?',
                vi: 'Bạn đã làm gì trước khi đến đây?'
            }
        ]
    },

    // Past Perfect Continuous
    {
        id: 'past-perfect-continuous',
        name: 'Past Perfect Continuous',
        nameVi: 'Thì quá khứ hoàn thành tiếp diễn',
        category: 'past',
        type: 'perfect-continuous',
        color: '#3B82F6',
        definition: 'The past perfect continuous tense emphasizes the duration of an action that was in progress before another action in the past.',
        definitionVi: 'Thì quá khứ hoàn thành tiếp diễn nhấn mạnh tính liên tục của hành động đã diễn ra trước một hành động khác trong quá khứ.',

        formulas: {
            affirmative: {
                regular: 'S + had + been + V-ing'
            },
            negative: {
                regular: 'S + had + not + been + V-ing'
            },
            interrogative: {
                regular: 'Had + S + been + V-ing?'
            },
            wh_question: {
                regular: 'Từ hỏi + had + S + been + V-ing?'
            }
        },

        usages: [
            {
                title: 'Diễn tả hành động bắt đầu trong quá khứ và kéo dài liên tục cho đến khi có hành động khác xen vào',
                description: 'Hành động liên tục đến khi bị gián đoạn',
                example: {
                    en: 'I had been waiting for 3 hours when she arrived.',
                    vi: 'Tôi đã đợi được 3 giờ khi cô ấy đến.'
                }
            },
            {
                title: 'Diễn tả nguyên nhân của một sự việc trong quá khứ',
                description: 'Giải thích nguyên nhân',
                example: {
                    en: 'She was tired because she had been working all day.',
                    vi: 'Cô ấy mệt vì đã làm việc cả ngày.'
                }
            }
        ],

        timeMarkers: [
            'before', 'when', 'for', 'since',
            'until', 'by the time'
        ],

        examples: [
            {
                type: 'affirmative',
                en: 'They had been playing for an hour when it started raining.',
                vi: 'Họ đã chơi được một giờ thì trời bắt đầu mưa.'
            },
            {
                type: 'negative',
                en: 'She had not been feeling well for weeks.',
                vi: 'Cô ấy đã không khỏe trong nhiều tuần.'
            },
            {
                type: 'interrogative',
                en: 'Had you been studying before the test?',
                vi: 'Bạn đã học trước kỳ thi chưa?'
            },
            {
                type: 'wh_question',
                en: 'How long had you been working there?',
                vi: 'Bạn đã làm việc ở đó được bao lâu?'
            }
        ]
    },

    // Future Simple
    {
        id: 'future-simple',
        name: 'Future Simple',
        nameVi: 'Thì tương lai đơn',
        category: 'future',
        type: 'simple',
        color: '#EC4899',
        definition: 'The future simple tense is used to describe actions that will happen in the future.',
        definitionVi: 'Thì tương lai đơn được dùng để diễn tả hành động sẽ xảy ra trong tương lai.',

        formulas: {
            affirmative: {
                regular: 'S + will + V_inf',
                toBe: 'S + will + be + ...'
            },
            negative: {
                regular: 'S + will not (won\'t) + V_inf',
                toBe: 'S + will not (won\'t) + be + ...'
            },
            interrogative: {
                regular: 'Will + S + V_inf?',
                toBe: 'Will + S + be...?'
            },
            wh_question: {
                regular: 'Từ hỏi + will + S + V_inf?',
                toBe: 'Từ hỏi + will + S + be...?'
            }
        },

        usages: [
            {
                title: 'Diễn tả quyết định nhất thời tại thời điểm nói',
                description: 'Quyết định ngay lập tức',
                example: {
                    en: 'I\'m tired. I will go to bed.',
                    vi: 'Tôi mệt. Tôi sẽ đi ngủ.'
                }
            },
            {
                title: 'Diễn tả dự đoán không có căn cứ',
                description: 'Dự đoán về tương lai',
                example: {
                    en: 'It will rain tomorrow.',
                    vi: 'Ngày mai trời sẽ mưa.'
                }
            },
            {
                title: 'Diễn tả lời hứa, đề nghị, yêu cầu',
                description: 'Promise, offer, request',
                example: {
                    en: 'I will help you.',
                    vi: 'Tôi sẽ giúp bạn.'
                }
            }
        ],

        timeMarkers: [
            'tomorrow', 'next day/week/month/year',
            'in + thời gian', 'soon', 'someday',
            'in the future', 'I think', 'I hope',
            'probably', 'perhaps', 'maybe'
        ],

        examples: [
            {
                type: 'affirmative',
                en: 'I will call you tomorrow.',
                vi: 'Tôi sẽ gọi cho bạn vào ngày mai.'
            },
            {
                type: 'negative',
                en: 'She will not go to the party.',
                vi: 'Cô ấy sẽ không đến bữa tiệc.'
            },
            {
                type: 'interrogative',
                en: 'Will you help me?',
                vi: 'Bạn sẽ giúp tôi chứ?'
            },
            {
                type: 'wh_question',
                en: 'What will you do this weekend?',
                vi: 'Cuối tuần này bạn sẽ làm gì?'
            }
        ]
    },

    // Future Continuous
    {
        id: 'future-continuous',
        name: 'Future Continuous',
        nameVi: 'Thì tương lai tiếp diễn',
        category: 'future',
        type: 'continuous',
        color: '#F472B6',
        definition: 'The future continuous tense is used to describe actions that will be in progress at a specific time in the future.',
        definitionVi: 'Thì tương lai tiếp diễn được dùng để diễn tả hành động sẽ đang xảy ra tại một thời điểm xác định trong tương lai.',

        formulas: {
            affirmative: {
                regular: 'S + will + be + V-ing'
            },
            negative: {
                regular: 'S + will not + be + V-ing'
            },
            interrogative: {
                regular: 'Will + S + be + V-ing?'
            },
            wh_question: {
                regular: 'Từ hỏi + will + S + be + V-ing?'
            }
        },

        usages: [
            {
                title: 'Diễn tả hành động sẽ đang xảy ra tại một thời điểm xác định trong tương lai',
                description: 'Hành động đang diễn ra trong tương lai',
                example: {
                    en: 'I will be studying at 8 PM tonight.',
                    vi: 'Tôi sẽ đang học lúc 8 giờ tối nay.'
                }
            },
            {
                title: 'Diễn tả hành động sẽ đang xảy ra khi có hành động khác xen vào trong tương lai',
                description: 'Hai hành động trong tương lai',
                example: {
                    en: 'When you arrive, I will be working.',
                    vi: 'Khi bạn đến, tôi sẽ đang làm việc.'
                }
            }
        ],

        timeMarkers: [
            'at + giờ + thời gian trong tương lai',
            'at this time next week/month',
            'this time tomorrow',
            'when', 'while'
        ],

        examples: [
            {
                type: 'affirmative',
                en: 'She will be traveling to Paris next week.',
                vi: 'Tuần sau cô ấy sẽ đang đi Paris.'
            },
            {
                type: 'negative',
                en: 'I will not be working tomorrow.',
                vi: 'Ngày mai tôi sẽ không làm việc.'
            },
            {
                type: 'interrogative',
                en: 'Will you be using the computer tonight?',
                vi: 'Tối nay bạn có dùng máy tính không?'
            },
            {
                type: 'wh_question',
                en: 'What will you be doing at 9 AM tomorrow?',
                vi: 'Bạn sẽ đang làm gì lúc 9 giờ sáng mai?'
            }
        ]
    },

    // Future Perfect
    {
        id: 'future-perfect',
        name: 'Future Perfect',
        nameVi: 'Thì tương lai hoàn thành',
        category: 'future',
        type: 'perfect',
        color: '#FB7185',
        definition: 'The future perfect tense is used to describe an action that will be completed before a specific time in the future.',
        definitionVi: 'Thì tương lai hoàn thành được dùng để diễn tả hành động sẽ hoàn thành trước một thời điểm xác định trong tương lai.',

        formulas: {
            affirmative: {
                regular: 'S + will + have + V3/V-ed'
            },
            negative: {
                regular: 'S + will not + have + V3/V-ed'
            },
            interrogative: {
                regular: 'Will + S + have + V3/V-ed?'
            },
            wh_question: {
                regular: 'Từ hỏi + will + S + have + V3/V-ed?'
            }
        },

        usages: [
            {
                title: 'Diễn tả hành động sẽ hoàn thành trước một thời điểm trong tương lai',
                description: 'Hành động hoàn thành trước mốc thời gian',
                example: {
                    en: 'I will have finished my work by 5 PM.',
                    vi: 'Tôi sẽ hoàn thành công việc trước 5 giờ chiều.'
                }
            },
            {
                title: 'Diễn tả hành động sẽ hoàn thành trước một hành động khác trong tương lai',
                description: 'Hành động hoàn thành trước hành động khác',
                example: {
                    en: 'She will have left before you arrive.',
                    vi: 'Cô ấy sẽ đi trước khi bạn đến.'
                }
            }
        ],

        timeMarkers: [
            'by + thời gian trong tương lai',
            'by the time',
            'before', 'by then',
            'by the end of + thời gian'
        ],

        examples: [
            {
                type: 'affirmative',
                en: 'I will have completed the project by next month.',
                vi: 'Tôi sẽ hoàn thành dự án vào tháng sau.'
            },
            {
                type: 'negative',
                en: 'They will not have arrived by 6 PM.',
                vi: 'Họ sẽ không đến trước 6 giờ chiều.'
            },
            {
                type: 'interrogative',
                en: 'Will you have finished by tomorrow?',
                vi: 'Bạn sẽ hoàn thành vào ngày mai chứ?'
            },
            {
                type: 'wh_question',
                en: 'When will you have finished?',
                vi: 'Khi nào bạn sẽ hoàn thành?'
            }
        ]
    },

    // Future Perfect Continuous
    {
        id: 'future-perfect-continuous',
        name: 'Future Perfect Continuous',
        nameVi: 'Thì tương lai hoàn thành tiếp diễn',
        category: 'future',
        type: 'perfect-continuous',
        color: '#FDA4AF',
        definition: 'The future perfect continuous tense emphasizes the duration of an action that will be in progress before a specific time in the future.',
        definitionVi: 'Thì tương lai hoàn thành tiếp diễn nhấn mạnh tính liên tục của hành động sẽ diễn ra trước một thời điểm trong tương lai.',

        formulas: {
            affirmative: {
                regular: 'S + will + have + been + V-ing'
            },
            negative: {
                regular: 'S + will not + have + been + V-ing'
            },
            interrogative: {
                regular: 'Will + S + have + been + V-ing?'
            },
            wh_question: {
                regular: 'Từ hỏi + will + S + have + been + V-ing?'
            }
        },

        usages: [
            {
                title: 'Diễn tả hành động sẽ đang diễn ra và kéo dài đến một thời điểm nhất định trong tương lai',
                description: 'Nhấn mạnh tính liên tục của hành động',
                example: {
                    en: 'By next month, I will have been working here for 5 years.',
                    vi: 'Đến tháng sau, tôi sẽ làm việc ở đây được 5 năm.'
                }
            }
        ],

        timeMarkers: [
            'by + thời gian',
            'for + khoảng thời gian',
            'by the time',
            'by the end of'
        ],

        examples: [
            {
                type: 'affirmative',
                en: 'By 2025, I will have been teaching for 10 years.',
                vi: 'Đến năm 2025, tôi sẽ dạy học được 10 năm.'
            },
            {
                type: 'negative',
                en: 'She will not have been working for long when she retires.',
                vi: 'Cô ấy sẽ không làm việc lâu khi nghỉ hưu.'
            },
            {
                type: 'interrogative',
                en: 'Will you have been living here for a year next month?',
                vi: 'Tháng sau bạn sẽ sống ở đây được một năm à?'
            },
            {
                type: 'wh_question',
                en: 'How long will you have been studying English?',
                vi: 'Bạn sẽ học tiếng Anh được bao lâu?'
            }
        ]
    }
];
