import { Calendar, Target, Check, KeyboardMusic, Guitar, Piano, Drum, MicVocal} from 'lucide-react';

const iconMap = {
  check: Check,
  calendar: Calendar,
  target: Target,
  keyboardmusic: KeyboardMusic,
  guitar: Guitar,
  piano: Piano,
  drum: Drum,
  micvocal: MicVocal
};

const sizeMap= {
    small: 14,
    medium: 32,
    large: 32
};

const GoalIcon = ({ name, size = "medium", color = "black"}) => {
    const key = name?.toLowerCase().trim();
    const Icon = iconMap[key];
    console.log("GoalIcon debug → name:", name, "key:", key, "size:", size, "color:", color, "Icon:", Icon);
    if (!Icon) return null;
    return <Icon size={sizeMap[size]} strokeWidth = {1.5} color = {color} />;
}

export default GoalIcon;