import { ref } from 'vue';
import doctorAvatar from '@/static/card/doctor.png';

import lvsq from '@/static/doctor/lqs.png';
import whm from '@/static/doctor/whm.png';
import zl from '@/static/doctor/zl.png';

export default () => {
	const doctorList = ref([
		{
			id: 2,
			name: '张莉',
			type: '主任、总支书记',
			fakeAvatar: doctorAvatar,
			avatar: zl,
			hospital: '新疆医科大学第一附属医院',
			department: '干部保健中心',
			skill: '擅长：从事临床工作30余年，有丰富的临床经验和扎实的理论基础知识。熟悉健康管理、内科常见疾病的诊疗。擅长呼吸系统、肿瘤的预防筛查及诊疗等。掌握相关专业领域最新研究和发展动态。',
			introduction:
				'主任医师、二级教授、博士、博士生导师、国务院特贴专家、医院学术带头人。现任中国抗癌协会肿瘤精准治疗专业委员会常委，海峡两岸医药卫生交流协会国际医疗与特需服务专业委员会常委，中国老年医学保健专业委员会委员，新疆抗癌协会肿瘤精准治疗专业委员会主任委员，新疆抗癌协会肿瘤营养专业委员会副主任委员，自治区保健专家委员会成员，第一届自治区保健工作质量控制中心主任等。主持国家级和省部级科研项目10余项，累计科研经费800万；发表核心期刊50余篇，专利1项，专著2部，获省部科技进步奖2项。累计培养博士9人，硕士50余人。',
		},
		{
			id: 1,
			name: '王红梅',
			type: '副主任',
			fakeAvatar: doctorAvatar,
			avatar: whm,
			hospital: '自治区人民医院',
			department: '综合保健内科二病区',
			// 擅长
			skill: '擅长：高血压、糖尿病、心血管病等急性期救治及慢病管理，共病、多重用药，肌少症、衰弱、营养不良的管理及干预。',
			// 简介
			introduction:
				'自治区人民医院老年病学科带头人。新疆医科大学博导、硕导。北京协和医学院博士后。意大利安科纳联合大学医院访问学者。从事内科工作25年，干部保健工作16年。有着丰富的临床经验及保健工作经验。主持国家自然科学基金2项、自治区自然基金2项、科技援疆项目1项。发表论文60余篇，其中SCI收录10篇（2篇 JCR Q1区，2篇JCR Q2区）。',
		},

		{
			id: 3,
			name: '吕全胜',
			type: '副主任',
			avatar: lvsq,
			fakeAvatar: doctorAvatar,
			hospital: '自治区中医医院',
			department: '干部保健三科',
			skill: '擅长：心血管疾病、老年健康管理。各种临床急、危、重症抢救治疗工作。',
			introduction:
				'对于老年心脑血管疾病有着丰富的临床治疗经验；目前为《火树华心悸临证经验集》主编、《现代中医临证指南》副主编，获得自治区自然科学基金项目等，国家《中医药骨伤特色救治能力建设项目》主办人，国家“十四五”全国高等院校行业规划教材《中西医结合急救医学》、《中医急诊学》编委。',
		},
	]);
	return {
		doctorList,
	};
};
