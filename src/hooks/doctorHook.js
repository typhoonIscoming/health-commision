import { ref } from 'vue';
import doctorAvatar from '@/static/card/doctor.png';

export default () => {
	const doctorList = ref([
		{
			id: 1,
			name: '热合曼',
			type: '主任医师',
			avatar: doctorAvatar,
			hospital: '乌鲁木齐市人民医院',
			department: '皮肤科',
			// 擅长
			skill: '擅长：皮肤病的诊治，尤其是过敏性皮肤病、慢性湿疹、顽固性荨麻疹等疾病的诊治',
		},
		{
			id: 2,
			name: '热合曼.阿娜尔罕',
			type: '心内科-主任医师',
			avatar: doctorAvatar,
			hospital: '乌鲁木齐市人民医院',
			department: '心内科',
			skill: '擅长：心血管疾病的诊治，尤其是高血压、冠心病、心律失常等疾病的诊治',
		},
		{
			id: 3,
			name: '热合曼',
			type: '心内科-主任医师',
			avatar: doctorAvatar,
			hospital: '乌鲁木齐市人民医院',
			department: '心内科',
			skill: '擅长：心血管疾病的诊治，尤其是高血压、冠心病、心律失常等疾病的诊治',
		},
	]);
	return {
		doctorList,
	};
};
