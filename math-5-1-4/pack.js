const PROBLEM_PACK = {
  name: '약분과 통분',
  emoji: '🔢',
  description: '약분·통분·분수 크기 비교·분수와 소수 비교',
  enemies: [
    { emoji: '🐛', name: '분수벌레', hp: 100 },
    { emoji: '🧮', name: '계산왕', hp: 130 },
    { emoji: '🔢', name: '숫자마왕', hp: 160 },
    { emoji: '🧙', name: '통분술사', hp: 190 },
    { emoji: '🐉', name: '분수드래곤', hp: 220 },
  ],
  problems: [

    // ────────────────────────────────
    // 이지: 약분 (작은 수, 직관적)
    // ────────────────────────────────
    { difficulty: 'easy', topic: '약분', hint: '분자와 분모를 같은 수로 나눠보세요. 2로 나눌 수 있나요?', text: '2/4를 약분하면?', answer: '1/2' },
    { difficulty: 'easy', topic: '약분', hint: '분자 4, 분모 8. 둘 다 4로 나누어지나요?', text: '4/8을 약분하면?', answer: '1/2' },
    { difficulty: 'easy', topic: '약분', hint: '분자 3, 분모 6. 공약수가 뭘까요?', text: '3/6을 약분하면?', answer: '1/2' },
    { difficulty: 'easy', topic: '약분', hint: '분자 2, 분모 6. 둘 다 2로 나눌 수 있어요.', text: '2/6을 약분하면?', answer: '1/3' },
    { difficulty: 'easy', topic: '약분', hint: '분자 3, 분모 9. 3의 배수예요.', text: '3/9를 약분하면?', answer: '1/3' },
    { difficulty: 'easy', topic: '약분', hint: '분자 4, 분모 6. 최대공약수가 2예요.', text: '4/6을 약분하면?', answer: '2/3' },
    { difficulty: 'easy', topic: '약분', hint: '분자 6, 분모 9. 3으로 나눠보세요.', text: '6/9를 약분하면?', answer: '2/3' },
    { difficulty: 'easy', topic: '약분', hint: '분자 4, 분모 10. 둘 다 2로 나눌 수 있어요.', text: '4/10을 약분하면?', answer: '2/5' },
    { difficulty: 'easy', topic: '약분', hint: '분자 5, 분모 10. 5로 나눠보세요.', text: '5/10을 약분하면?', answer: '1/2' },
    { difficulty: 'easy', topic: '약분', hint: '분자 6, 분모 8. 최대공약수가 2예요.', text: '6/8을 약분하면?', answer: '3/4' },
    { difficulty: 'easy', topic: '약분', hint: '분자 8, 분모 12. 4로 나눠보세요.', text: '8/12를 약분하면?', answer: '2/3' },
    { difficulty: 'easy', topic: '약분', hint: '분자 9, 분모 12. 3으로 나눠보세요.', text: '9/12를 약분하면?', answer: '3/4' },

    // 이지: 통분 (분모 관계 간단)
    { difficulty: 'easy', topic: '통분', hint: '1/2의 분모 2와 1/4의 분모 4. 4가 2의 배수니까 공통분모는 4예요.', text: '1/2와 1/4의 공통분모(최소)는?', answer: '4' },
    { difficulty: 'easy', topic: '통분', hint: '분모 3과 6. 6이 3의 배수니까 공통분모는 6이에요.', text: '1/3와 1/6의 공통분모(최소)는?', answer: '6' },
    { difficulty: 'easy', topic: '통분', hint: '분모 4와 8. 8이 4의 배수예요.', text: '1/4와 1/8의 공통분모(최소)는?', answer: '8' },
    { difficulty: 'easy', topic: '통분', hint: '분모 5와 10. 10이 5의 배수예요.', text: '1/5와 1/10의 공통분모(최소)는?', answer: '10' },
    { difficulty: 'easy', topic: '통분', hint: '2/3을 분모 6으로 만들려면 분자, 분모에 2를 곱해요.', text: '2/3을 분모 6으로 통분하면?', answer: '4/6' },
    { difficulty: 'easy', topic: '통분', hint: '1/2를 분모 8로 만들려면 분자, 분모에 4를 곱해요.', text: '1/2를 분모 8로 통분하면?', answer: '4/8' },
    { difficulty: 'easy', topic: '통분', hint: '1/3을 분모 9로 만들려면 분자, 분모에 3을 곱해요.', text: '1/3을 분모 9로 통분하면?', answer: '3/9' },
    { difficulty: 'easy', topic: '통분', hint: '3/5를 분모 10으로 만들려면 분자, 분모에 2를 곱해요.', text: '3/5를 분모 10으로 통분하면?', answer: '6/10' },

    // 이지: 크기 비교 (분모 같거나 단순)
    { difficulty: 'easy', topic: '크기비교', hint: '분모가 같으면 분자가 클수록 큰 분수예요.', text: '3/7과 5/7 중 더 큰 것은?', answer: '5/7', choices: ['3/7', '5/7'] },
    { difficulty: 'easy', topic: '크기비교', hint: '분모가 같으면 분자가 클수록 커요.', text: '2/9과 7/9 중 더 큰 것은?', answer: '7/9', choices: ['2/9', '7/9'] },
    { difficulty: 'easy', topic: '크기비교', hint: '분자가 같으면 분모가 작을수록 큰 분수예요.', text: '1/3과 1/5 중 더 큰 것은?', answer: '1/3', choices: ['1/3', '1/5'] },
    { difficulty: 'easy', topic: '크기비교', hint: '분자가 같을 때 분모가 작을수록 커요.', text: '1/2과 1/4 중 더 큰 것은?', answer: '1/2', choices: ['1/2', '1/4'] },
    { difficulty: 'easy', topic: '크기비교', hint: '1/2 = 0.5, 1/4 = 0.25. 어느 쪽이 더 크죠?', text: '1/2과 1/4 중 더 작은 것은?', answer: '1/4' },

    // 이지: 분수↔소수 (간단한 변환)
    { difficulty: 'easy', topic: '분수↔소수', hint: '1/2 = 1 ÷ 2를 계산해보세요.', text: '1/2를 소수로 나타내면?', answer: '0.5' },
    { difficulty: 'easy', topic: '분수↔소수', hint: '1/10 = 0.1이에요. 분모가 10이면 소수 첫째 자리예요.', text: '3/10을 소수로 나타내면?', answer: '0.3' },
    { difficulty: 'easy', topic: '분수↔소수', hint: '7/10 = 7 ÷ 10이에요.', text: '7/10을 소수로 나타내면?', answer: '0.7' },
    { difficulty: 'easy', topic: '분수↔소수', hint: '0.5 = 5/10 = 1/2예요.', text: '0.5와 1/2 중 더 큰 것은?', answer: '같다', choices: ['0.5', '1/2', '같다'] },
    { difficulty: 'easy', topic: '분수↔소수', hint: '1/2 = 0.5예요. 0.3과 비교해보세요.', text: '1/2과 0.3 중 더 큰 것은?', answer: '1/2', choices: ['1/2', '0.3'] },

    // ────────────────────────────────
    // 노멀: 약분 (두 자리 수, 최대공약수 필요)
    // ────────────────────────────────
    { difficulty: 'normal', topic: '약분', hint: '12와 18의 최대공약수는 6이에요. 둘 다 6으로 나눠보세요.', text: '12/18을 기약분수로 나타내면?', answer: '2/3' },
    { difficulty: 'normal', topic: '약분', hint: '15와 20의 최대공약수는 5예요.', text: '15/20을 기약분수로 나타내면?', answer: '3/4' },
    { difficulty: 'normal', topic: '약분', hint: '16과 24의 최대공약수는 8이에요.', text: '16/24를 기약분수로 나타내면?', answer: '2/3' },
    { difficulty: 'normal', topic: '약분', hint: '14와 21의 최대공약수는 7이에요.', text: '14/21을 기약분수로 나타내면?', answer: '2/3' },
    { difficulty: 'normal', topic: '약분', hint: '18과 24의 최대공약수는 6이에요.', text: '18/24를 기약분수로 나타내면?', answer: '3/4' },
    { difficulty: 'normal', topic: '약분', hint: '20과 30의 최대공약수는 10이에요.', text: '20/30을 기약분수로 나타내면?', answer: '2/3' },
    { difficulty: 'normal', topic: '약분', hint: '24와 36의 최대공약수는 12예요.', text: '24/36을 기약분수로 나타내면?', answer: '2/3' },
    { difficulty: 'normal', topic: '약분', hint: '21과 28의 최대공약수는 7이에요.', text: '21/28을 기약분수로 나타내면?', answer: '3/4' },
    { difficulty: 'normal', topic: '약분', hint: '10과 25의 최대공약수는 5예요.', text: '10/25를 기약분수로 나타내면?', answer: '2/5' },
    { difficulty: 'normal', topic: '약분', hint: '16과 20의 최대공약수는 4예요.', text: '16/20을 기약분수로 나타내면?', answer: '4/5' },

    // 노멀: 통분 (최소공배수 필요)
    { difficulty: 'normal', topic: '통분', hint: '2와 3의 최소공배수는 6이에요. 공통분모로 사용해요.', text: '1/2와 1/3의 공통분모(최소)는?', answer: '6' },
    { difficulty: 'normal', topic: '통분', hint: '3과 4의 최소공배수는 12예요.', text: '1/3와 1/4의 공통분모(최소)는?', answer: '12' },
    { difficulty: 'normal', topic: '통분', hint: '4와 6의 최소공배수는 12예요. 4×3=12, 6×2=12.', text: '1/4와 1/6의 공통분모(최소)는?', answer: '12' },
    { difficulty: 'normal', topic: '통분', hint: '2와 5의 최소공배수는 10이에요.', text: '1/2와 1/5의 공통분모(최소)는?', answer: '10' },
    { difficulty: 'normal', topic: '통분', hint: '3과 5의 최소공배수는 15예요.', text: '1/3와 1/5의 공통분모(최소)는?', answer: '15' },
    { difficulty: 'normal', topic: '통분', hint: '3/4를 분모 12로: 분자 분모에 3을 곱해요.', text: '3/4를 분모 12로 통분하면?', answer: '9/12' },
    { difficulty: 'normal', topic: '통분', hint: '2/3를 분모 9로: 분자 분모에 3을 곱해요.', text: '2/3를 분모 9로 통분하면?', answer: '6/9' },
    { difficulty: 'normal', topic: '통분', hint: '2/5를 분모 15로: 분자 분모에 3을 곱해요.', text: '2/5를 분모 15로 통분하면?', answer: '6/15' },
    { difficulty: 'normal', topic: '통분', hint: '3/4를 분모 20으로: 분자 분모에 5를 곱해요.', text: '3/4를 분모 20으로 통분하면?', answer: '15/20' },
    { difficulty: 'normal', topic: '통분', hint: '5/6를 분모 18로: 분자 분모에 3을 곱해요.', text: '5/6를 분모 18로 통분하면?', answer: '15/18' },

    // 노멀: 크기 비교
    { difficulty: 'normal', topic: '크기비교', hint: '통분해서 비교해요. 공통분모는 4예요.', text: '1/2과 3/4 중 더 큰 것은?', answer: '3/4', choices: ['1/2', '3/4'] },
    { difficulty: 'normal', topic: '크기비교', hint: '공통분모 6으로 통분해보세요. 1/2=3/6, 1/3=2/6.', text: '1/2과 1/3 중 더 큰 것은?', answer: '1/2', choices: ['1/2', '1/3'] },
    { difficulty: 'normal', topic: '크기비교', hint: '공통분모 15: 2/3=10/15, 3/5=9/15.', text: '2/3과 3/5 중 더 큰 것은?', answer: '2/3', choices: ['2/3', '3/5'] },
    { difficulty: 'normal', topic: '크기비교', hint: '공통분모 12: 3/4=9/12, 2/3=8/12.', text: '3/4과 2/3 중 더 큰 것은?', answer: '3/4', choices: ['3/4', '2/3'] },
    { difficulty: 'normal', topic: '크기비교', hint: '공통분모 8: 1/2=4/8, 3/8은 그대로.', text: '1/2과 3/8 중 더 큰 것은?', answer: '1/2', choices: ['1/2', '3/8'] },
    { difficulty: 'normal', topic: '크기비교', hint: '공통분모 10: 4/5=8/10, 7/10은 그대로.', text: '4/5과 7/10 중 더 큰 것은?', answer: '4/5', choices: ['4/5', '7/10'] },
    { difficulty: 'normal', topic: '크기비교', hint: '공통분모 12: 5/6=10/12, 7/12는 그대로.', text: '5/6과 7/12 중 더 큰 것은?', answer: '5/6', choices: ['5/6', '7/12'] },
    { difficulty: 'normal', topic: '크기비교', hint: '공통분모 12: 2/3=8/12, 3/4=9/12.', text: '2/3과 3/4 중 더 큰 것은?', answer: '3/4', choices: ['2/3', '3/4'] },

    // 노멀: 분수↔소수
    { difficulty: 'normal', topic: '분수↔소수', hint: '1/4 = 1 ÷ 4를 계산해보세요.', text: '1/4를 소수로 나타내면?', answer: '0.25' },
    { difficulty: 'normal', topic: '분수↔소수', hint: '3/4 = 3 ÷ 4를 계산해보세요.', text: '3/4를 소수로 나타내면?', answer: '0.75' },
    { difficulty: 'normal', topic: '분수↔소수', hint: '1/5 = 1 ÷ 5를 계산해보세요.', text: '1/5를 소수로 나타내면?', answer: '0.2' },
    { difficulty: 'normal', topic: '분수↔소수', hint: '3/5 = 3 ÷ 5를 계산해보세요.', text: '3/5를 소수로 나타내면?', answer: '0.6' },
    { difficulty: 'normal', topic: '분수↔소수', hint: '3/5 = 0.6이에요. 0.6과 비교해보세요.', text: '3/5과 0.6 중 더 큰 것은?', answer: '같다', choices: ['3/5', '0.6', '같다'] },
    { difficulty: 'normal', topic: '분수↔소수', hint: '3/4 = 0.75예요. 0.8과 비교해보세요.', text: '3/4과 0.8 중 더 큰 것은?', answer: '0.8', choices: ['3/4', '0.8'] },
    { difficulty: 'normal', topic: '분수↔소수', hint: '4/5 = 0.8이에요. 0.75와 비교해보세요.', text: '4/5과 0.75 중 더 큰 것은?', answer: '4/5', choices: ['4/5', '0.75'] },
    { difficulty: 'normal', topic: '분수↔소수', hint: '1/2 = 0.5예요. 0.4와 비교해보세요.', text: '1/2과 0.4 중 더 큰 것은?', answer: '1/2', choices: ['1/2', '0.4'] },

    // ────────────────────────────────
    // 하드: 약분 (세 자리 수, 복잡한 최대공약수)
    // ────────────────────────────────
    { difficulty: 'hard', topic: '약분', hint: '36과 48의 최대공약수를 구해보세요. 36=4×9, 48=4×12이므로 4가 공약수. 더 큰 공약수가 있나요?', text: '36/48을 기약분수로 나타내면?', answer: '3/4' },
    { difficulty: 'hard', topic: '약분', hint: '45와 60의 최대공약수는 15예요.', text: '45/60을 기약분수로 나타내면?', answer: '3/4' },
    { difficulty: 'hard', topic: '약분', hint: '28과 42의 최대공약수는 14예요.', text: '28/42를 기약분수로 나타내면?', answer: '2/3' },
    { difficulty: 'hard', topic: '약분', hint: '24와 40의 최대공약수는 8이에요.', text: '24/40을 기약분수로 나타내면?', answer: '3/5' },
    { difficulty: 'hard', topic: '약분', hint: '30과 45의 최대공약수는 15예요.', text: '30/45를 기약분수로 나타내면?', answer: '2/3' },
    { difficulty: 'hard', topic: '약분', hint: '56과 72의 최대공약수는 8이에요.', text: '56/72를 기약분수로 나타내면?', answer: '7/9' },
    { difficulty: 'hard', topic: '약분', hint: '42와 70의 최대공약수는 14예요.', text: '42/70을 기약분수로 나타내면?', answer: '3/5' },
    { difficulty: 'hard', topic: '약분', hint: '54와 72의 최대공약수는 18이에요.', text: '54/72를 기약분수로 나타내면?', answer: '3/4' },

    // 하드: 통분 (큰 수 최소공배수)
    { difficulty: 'hard', topic: '통분', hint: '4와 6의 최소공배수: 4의 배수(4,8,12…)와 6의 배수(6,12…)에서 처음 만나는 수는 12예요.', text: '3/4와 5/6의 공통분모(최소)는?', answer: '12' },
    { difficulty: 'hard', topic: '통분', hint: '6과 9의 최소공배수: 6의 배수(6,12,18…)와 9의 배수(9,18…)에서 처음 만나는 수는 18이에요.', text: '5/6와 7/9의 공통분모(최소)는?', answer: '18' },
    { difficulty: 'hard', topic: '통분', hint: '8과 12의 최소공배수: 8의 배수(8,16,24…)와 12의 배수(12,24…)에서 처음 만나는 수는 24예요.', text: '5/8와 7/12의 공통분모(최소)는?', answer: '24' },
    { difficulty: 'hard', topic: '통분', hint: '9와 15의 최소공배수: 9의 배수(9,18,27,36,45…)와 15의 배수(15,30,45…)에서 처음 만나는 수는 45예요.', text: '4/9와 7/15의 공통분모(최소)는?', answer: '45' },
    { difficulty: 'hard', topic: '통분', hint: '10과 15의 최소공배수: 10=2×5, 15=3×5이므로 2×3×5=30이에요.', text: '3/10와 4/15의 공통분모(최소)는?', answer: '30' },

    // 하드: 크기 비교 (세 분수 비교)
    { difficulty: 'hard', topic: '크기비교', hint: '공통분모 12로 통분: 2/3=8/12, 3/4=9/12, 7/12는 그대로.', text: '2/3, 3/4, 7/12 중 가장 큰 것은?', answer: '3/4', choices: ['2/3', '3/4', '7/12'] },
    { difficulty: 'hard', topic: '크기비교', hint: '공통분모 30: 3/5=18/30, 2/3=20/30, 7/10=21/30.', text: '3/5, 2/3, 7/10 중 가장 큰 것은?', answer: '7/10', choices: ['3/5', '2/3', '7/10'] },
    { difficulty: 'hard', topic: '크기비교', hint: '공통분모 24: 5/8=15/24, 7/12=14/24, 3/4=18/24.', text: '5/8, 7/12, 3/4 중 가장 큰 것은?', answer: '3/4', choices: ['5/8', '7/12', '3/4'] },
    { difficulty: 'hard', topic: '크기비교', hint: '공통분모 20: 3/4=15/20, 4/5=16/20, 7/10=14/20.', text: '3/4, 4/5, 7/10 중 가장 큰 것은?', answer: '4/5', choices: ['3/4', '4/5', '7/10'] },
    { difficulty: 'hard', topic: '크기비교', hint: '공통분모 18: 5/6=15/18, 7/9=14/18, 5/6이 더 크네요.', text: '5/6과 7/9 중 더 큰 것은?', answer: '5/6', choices: ['5/6', '7/9'] },

    // 하드: 분수↔소수 (복잡한 변환 + 세 수 비교)
    { difficulty: 'hard', topic: '분수↔소수', hint: '2/5 = 0.4, 3/8 = 0.375예요. 비교해보세요.', text: '2/5과 3/8 중 더 큰 것은?', answer: '2/5', choices: ['2/5', '3/8'] },
    { difficulty: 'hard', topic: '분수↔소수', hint: '7/8 = 0.875예요. 0.9와 비교해보세요.', text: '7/8과 0.9 중 더 큰 것은?', answer: '0.9', choices: ['7/8', '0.9'] },
    { difficulty: 'hard', topic: '분수↔소수', hint: '5/8 = 0.625예요. 0.63과 비교해보세요.', text: '5/8과 0.63 중 더 큰 것은?', answer: '0.63', choices: ['5/8', '0.63'] },
    { difficulty: 'hard', topic: '분수↔소수', hint: '3/8 = 0.375예요. 소수로 나타내면?', text: '3/8을 소수로 나타내면?', answer: '0.375' },
    { difficulty: 'hard', topic: '분수↔소수', hint: '0.625를 분수로: 625/1000 → 약분하면?', text: '0.625를 기약분수로 나타내면?', answer: '5/8' },
    { difficulty: 'hard', topic: '분수↔소수', hint: '0.24를 분수로: 24/100 → 최대공약수 4로 약분해요.', text: '0.24를 기약분수로 나타내면?', answer: '6/25' },
    { difficulty: 'hard', topic: '분수↔소수', hint: '3/4=0.75, 0.7, 5/8=0.625. 순서대로 비교해보세요.', text: '3/4, 0.7, 5/8 중 가장 큰 것은?', answer: '3/4', choices: ['3/4', '0.7', '5/8'] },
    { difficulty: 'hard', topic: '분수↔소수', hint: '2/3≈0.667, 0.65, 3/5=0.6. 비교해보세요.', text: '2/3, 0.65, 3/5 중 가장 큰 것은?', answer: '2/3', choices: ['2/3', '0.65', '3/5'] },

    // ────────────────────────────────
    // 하드: 문장제
    // ────────────────────────────────
    { difficulty: 'hard', topic: '문장제',
      hint: '전체 12칸 중 색칠한 칸의 수를 분수로 나타낸 뒤 기약분수로 약분해요.',
      text: '색종이를 12칸으로 나눠 그 중 8칸을 색칠했어요. 색칠한 부분을 기약분수로 나타내면?',
      answer: '2/3' },

    { difficulty: 'hard', topic: '문장제',
      hint: '전체 우유 양을 1로 놓고, 두 사람이 마신 양의 분모를 통분해서 비교해요.',
      text: '지호는 우유를 3/4컵, 민아는 5/6컵 마셨어요. 누가 더 많이 마셨나요?',
      answer: '민아', choices: ['지호', '민아', '같다'] },

    { difficulty: 'hard', topic: '문장제',
      hint: '피자 전체를 1로 볼 때, 먹은 조각의 수 ÷ 전체 조각 수를 기약분수로 나타내요.',
      text: '피자를 8조각으로 잘랐는데 6조각을 먹었어요. 먹은 양을 기약분수로 나타내면?',
      answer: '3/4' },

    { difficulty: 'hard', topic: '문장제',
      hint: '0.6을 분수로 바꾸면 6/10 = 3/5예요. 3/5와 2/3을 통분해서 비교해요.',
      text: '수조에 물이 0.6만큼 차 있고, 다른 수조엔 2/3만큼 차 있어요. 물이 더 많은 수조는?',
      answer: '2/3 수조', choices: ['0.6 수조', '2/3 수조', '같다'] },

    { difficulty: 'hard', topic: '문장제',
      hint: '전체 30명 중 18명이므로 18/30예요. 최대공약수 6으로 약분해보세요.',
      text: '학급 30명 중 18명이 안경을 써요. 안경 쓰는 학생의 비율을 기약분수로 나타내면?',
      answer: '3/5' },

    { difficulty: 'hard', topic: '문장제',
      hint: '3/8을 소수로 바꾸면 0.375예요. 0.4와 비교해보세요.',
      text: '줄넘기 기록이 민준이는 3/8분, 서연이는 0.4분이에요. 누가 더 오래 했나요?',
      answer: '서연', choices: ['민준', '서연', '같다'] },

    { difficulty: 'hard', topic: '문장제',
      hint: '36/48을 약분해요. 최대공약수 12로 나누면?',
      text: '리본 48cm 중 36cm를 사용했어요. 사용한 리본의 비율을 기약분수로 나타내면?',
      answer: '3/4' },

    { difficulty: 'hard', topic: '문장제',
      hint: '두 분수를 공통분모(30)로 통분한 뒤 크기를 비교해요.',
      text: '어머니는 밀가루 2/5kg, 아버지는 3/10kg을 사 왔어요. 누가 더 많이 샀나요?',
      answer: '어머니', choices: ['어머니', '아버지', '같다'] },

    { difficulty: 'hard', topic: '문장제',
      hint: '걸린 시간을 분수로: 45분 = 45/60시간. 최대공약수 15로 약분해요.',
      text: '등교하는 데 45분 걸렸어요. 1시간을 기준으로 기약분수로 나타내면?',
      answer: '3/4' },

    { difficulty: 'hard', topic: '문장제',
      hint: '0.625 = 625/1000. 최대공약수 125로 약분하면 5/8이에요.',
      text: '물통 용량의 0.625만큼 물이 담겨 있어요. 이를 기약분수로 나타내면?',
      answer: '5/8' },
  ]
};
