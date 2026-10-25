const PART_DATA = {
  oil: {
    name: '엔진오일 세트',
    limitKm: 10000,
    partCost: 45000,
    diyTasks: [
      '엔진오일 및 오일필터·에어클리너 규격품 구매하기',
      '폐유 수거통 및 렌치 준비 후 셀프 정비소 리프트 예약하기',
      '교체 완료 후 계기판 주행거리 기록 및 레벨게이지 양 점검하기'
    ],
    shopTasks: [
      '인근 정비소 방문 예약 및 엔진오일 재고 확인하기',
      '오일 교체 시 타이어 공기압 및 하부 누유 함께 점검 요청하기',
      '정비 명세서 수령 후 다음 교체 주기(10,000km 뒤) 메모하기'
    ]
  },
  coolant: {
    name: '냉각수·부동액',
    limitKm: 40000,
    partCost: 35000,
    diyTasks: [
      '차량 규격에 맞는 부동액과 정제수 준비하기',
      '엔진이 완전히 식은 상태에서 보조탱크 수위 및 호스 상태 점검하기',
      '주입 후 냉각 라인 에어빼기 작업 및 히터 작동 확인하기'
    ],
    shopTasks: [
      '냉각수 순환식 장비를 보유한 정비소 예약하기',
      '워터펌프 및 써모스탯 주변 누수 여부 함께 점검 요청하기',
      '교체 후 며칠간 냉각수 보조탱크 수위 변화 확인하기'
    ]
  },
  brake: {
    name: '브레이크 패드',
    limitKm: 30000,
    partCost: 60000,
    diyTasks: [
      '차량 연식에 맞는 전륜/후륜 브레이크 패드 및 캘리퍼 자키 준비하기',
      '패드 교체 전 브레이크액 리저버 탱크 넘침 방지 확인하기',
      '교체 직후 출발 전 브레이크 페달을 여러 번 밟아 압력 채우기'
    ],
    shopTasks: [
      '정비소 방문하여 브레이크 디스크 마모도 및 패드 잔량 확인하기',
      '패드 교체와 함께 브레이크액 수분도 테스트 요청하기',
      '주행 테스트로 제동 시 소음이나 떨림이 없는지 확인하기'
    ]
  }
};

const state = {
  selectedPartKey: '',
  mileage: '',
  urgencyText: '',
  method: 'shop',
  budget: ''
};

const partSelect = document.getElementById('part-select');
const mileageInput = document.getElementById('mileage-input');
const step1Error = document.getElementById('step1-error');
const step1Result = document.getElementById('step1-result');
const step1ResultTitle = document.getElementById('step1-result-title');
const step1ResultDesc = document.getElementById('step1-result-desc');

const step2Section = document.getElementById('step2-section');
const step2Context = document.getElementById('step2-context');
const methodSelect = document.getElementById('method-select');
const budgetInput = document.getElementById('budget-input');
const step2Error = document.getElementById('step2-error');
const step2Result = document.getElementById('step2-result');
const step2ResultTitle = document.getElementById('step2-result-title');
const step2ResultDesc = document.getElementById('step2-result-desc');
const step2Checklist = document.getElementById('step2-checklist');

document.getElementById('btn-check-step1').addEventListener('click', () => {
  const partKey = partSelect.value;
  const rawMileage = mileageInput.value.trim();
  const numMileage = Number(rawMileage);

  if (!partKey) {
    showError(step1Error, '점검할 소모품 종류를 먼저 선택해 주세요.');
    step1Result.classList.add('is-hidden');
    partSelect.focus();
    return;
  }

  if (rawMileage === '' || isNaN(numMileage) || numMileage < 0 || numMileage > 200000) {
    showError(step1Error, '주행거리는 0 이상 200,000 이하의 숫자로 입력한 뒤 다시 확인을 눌러주세요.');
    step1Result.classList.add('is-hidden');
    mileageInput.focus();
    return;
  }

  hideError(step1Error);

  const part = PART_DATA[partKey];
  state.selectedPartKey = partKey;
  state.mileage = numMileage;

  if (numMileage >= part.limitKm) {
    state.urgencyText = '즉시 교체 권장';
    step1ResultTitle.textContent = `[점검 결과] ${part.name} - 즉시 교체가 필요합니다!`;
    step1ResultDesc.textContent = `현재 주행거리(${numMileage.toLocaleString()}km)가 권장 주기(${part.limitKm.toLocaleString()}km)를 초과했습니다. 기본 부품비는 약 ${part.partCost.toLocaleString()}원입니다.`;
  } else {
    const remainKm = part.limitKm - numMileage;
    state.urgencyText = '여유 있음 (사전 예산 점검 가능)';
    step1ResultTitle.textContent = `[점검 결과] ${part.name} - 교체 주기까지 ${remainKm.toLocaleString()}km 남았습니다.`;
    step1ResultDesc.textContent = `아직 권장 주기 이내이지만, 미리 다음 정비를 위한 예산 시뮬레이션을 진행할 수 있습니다. 기본 부품비는 약 ${part.partCost.toLocaleString()}원입니다.`;
  }

  step1Result.classList.remove('is-hidden');
});

document.getElementById('btn-reset-step1').addEventListener('click', () => {
  partSelect.value = '';
  mileageInput.value = '';
  hideError(step1Error);
  step1Result.classList.add('is-hidden');
  step2Section.classList.add('is-hidden');
});

document.getElementById('btn-go-step2').addEventListener('click', () => {
  const part = PART_DATA[state.selectedPartKey];
  step2Context.textContent = `1단계 선택 항목: ${part.name} (주행거리 ${state.mileage.toLocaleString()}km / 상태: ${state.urgencyText} / 기본 부품비: ${part.partCost.toLocaleString()}원)`;
  step2Section.classList.remove('is-hidden');
  step2Section.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('btn-run-sim').addEventListener('click', () => {
  const method = methodSelect.value;
  const rawBudget = budgetInput.value.trim();
  const numBudget = Number(rawBudget);

  if (rawBudget === '' || isNaN(numBudget) || numBudget < 10000 || numBudget > 500000) {
    showError(
      step2Error,
      '입력 오류: 가용 예산 칸에 10,000 이상 500,000 이하의 숫자를 입력한 뒤 [예산 조건 확인 및 계획 생성] 버튼을 다시 눌러주세요.'
    );
    step2Result.classList.add('is-hidden');
    budgetInput.focus();
    return;
  }

  hideError(step2Error);
  state.method = method;
  state.budget = numBudget;

  const part = PART_DATA[state.selectedPartKey];
  const extraCost = method === 'shop' ? 40000 : 10000;
  const methodName = method === 'shop' ? '정비소 방문 교체' : '셀프 정비(DIY)';
  const totalCost = part.partCost + extraCost;

  step2Result.className = 'result-box';

  if (numBudget < totalCost) {
    const shortage = totalCost - numBudget;
    step2Result.classList.add('status-warning');
    step2ResultTitle.textContent = '조건 미달: 입력한 예산으로 실행 가능한 계획이 없습니다';
    step2ResultDesc.textContent = `선택하신 [${part.name} - ${methodName}]의 총 예상 비용은 ${totalCost.toLocaleString()}원이며, 현재 입력 예산(${numBudget.toLocaleString()}원)보다 ${shortage.toLocaleString()}원이 부족합니다. 아래 [예산·방식 다시 수정]을 눌러 예산을 높이거나, 공임비가 적게 드는 '셀프 정비(DIY)'로 방식을 변경해 보세요.`;
    step2Checklist.classList.add('is-hidden');
    step2Checklist.innerHTML = '';
  } else {
    const remainBudget = numBudget - totalCost;
    const tasks = method === 'shop' ? part.shopTasks : part.diyTasks;

    step2Result.classList.add('status-success');
    step2ResultTitle.textContent = `시뮬레이션 완료: ${part.name} (${methodName}) 실행 가능!`;
    step2ResultDesc.textContent = `총 예상 비용은 ${totalCost.toLocaleString()}원이며, 예산 내에서 진행 후 ${remainBudget.toLocaleString()}원이 남습니다. 아래 맞춤형 실행 체크리스트를 확인하세요.`;

    step2Checklist.innerHTML = '';
    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.textContent = task;
      step2Checklist.appendChild(li);
    });
    step2Checklist.classList.remove('is-hidden');
  }

  step2Result.classList.remove('is-hidden');
});

document.getElementById('btn-cancel-sim').addEventListener('click', () => {
  hideError(step2Error);
  step2Result.className = 'result-box status-canceled';
  step2ResultTitle.textContent = '예산 시뮬레이션이 취소되었습니다';
  step2ResultDesc.textContent = '추가 예산 계획을 세우지 않고 1단계 기본 점검 결과만 유지합니다. 다시 계산하려면 아래 수정 버튼을 누르거나 처음부터 다시 시작할 수 있습니다.';
  step2Checklist.classList.add('is-hidden');
  step2Checklist.innerHTML = '';
  step2Result.classList.remove('is-hidden');
});

document.getElementById('btn-edit-step2').addEventListener('click', () => {
  step2Result.classList.add('is-hidden');
  methodSelect.value = state.method;
  budgetInput.value = state.budget;
  budgetInput.focus();
});

document.getElementById('btn-back-step1').addEventListener('click', () => {
  step2Result.classList.add('is-hidden');
  document.getElementById('step1-section').scrollIntoView({ behavior: 'smooth' });
  partSelect.focus();
});

document.getElementById('btn-reset-all').addEventListener('click', () => {
  state.selectedPartKey = '';
  state.mileage = '';
  state.urgencyText = '';
  state.method = 'shop';
  state.budget = '';

  partSelect.value = '';
  mileageInput.value = '';
  methodSelect.value = 'shop';
  budgetInput.value = '';

  hideError(step1Error);
  hideError(step2Error);
  step1Result.classList.add('is-hidden');
  step2Result.classList.add('is-hidden');
  step2Section.classList.add('is-hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function showError(element, message) {
  element.textContent = message;
  element.classList.remove('is-hidden');
}

function hideError(element) {
  element.textContent = '';
  element.classList.add('is-hidden');
}
