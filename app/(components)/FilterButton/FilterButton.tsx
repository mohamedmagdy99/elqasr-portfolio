import { motion } from 'framer-motion';
import clsx from 'clsx'; // or use cn()

export const FilterButton = ({
                          children,
                          onClick,
                          active = false,
                      }: {
    children: React.ReactNode;
    onClick: () => void;
    active?: boolean;
}) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={clsx(
            'px-4 py-2 border-b-2 transition-all duration-200',
            active ? 'border-black text-black font-semibold' : 'border-transparent text-gray-600'
        )}
        onClick={onClick}
    >
        {children}
    </motion.button>
);