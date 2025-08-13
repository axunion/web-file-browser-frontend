import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import Modal from "@/components/Modal";
import useFileRename from "@/hooks/useFileRename";
import type { DirectoryItem } from "@/types/api";
import { getPath } from "@/utils/path";

export type RenameModalProps = {
	item: DirectoryItem;
	onClose: () => void;
	onSuccess: () => void;
};

const RenameModal = ({ item, onClose, onSuccess }: RenameModalProps) => {
	const originalName = item.name;
	const dotIndex = item.type === "file" ? originalName.lastIndexOf(".") : -1;
	const hasExtension = dotIndex > 0;
	const nameWithoutExt = hasExtension
		? originalName.substring(0, dotIndex)
		: originalName;
	const extension = hasExtension ? originalName.substring(dotIndex) : "";

	const [newName, setNewName] = useState(nameWithoutExt);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const { renameFile, isLoading, error: renameError } = useFileRename();

	const validateName = (trimmed: string): string | null => {
		if (trimmed === "." || trimmed === "..") {
			return "この名前は使用できません";
		}

		// Invalid characters for file systems
		const invalidChars = ["<", ">", ":", '"', "/", "\\", "|", "?", "*"];
		const hasInvalidChar = invalidChars.some((char) => trimmed.includes(char));

		// Check for control characters
		const hasControlChar = trimmed.split("").some((char) => {
			const code = char.charCodeAt(0);
			return code < 32 || (code >= 127 && code <= 159);
		});

		if (hasInvalidChar || hasControlChar) {
			return "使用できない文字が含まれています";
		}

		return null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const trimmed = newName.trim();
		const validationError = validateName(trimmed);

		if (validationError) {
			setError(validationError);
			return;
		}

		// Create full filename with extension for files
		const fullNewName = trimmed + extension;

		if (trimmed === nameWithoutExt) {
			onClose();
			return;
		}

		try {
			await renameFile({
				path: getPath().path,
				name: originalName,
				newName: fullNewName,
			});
			onSuccess();
		} catch {
			setError(renameError || "リネームに失敗しました");
		}
	};

	useEffect(() => {
		if (!inputRef.current) return;
		inputRef.current.focus();
		inputRef.current.select();
	}, []);

	return (
		<Modal onClose={onClose}>
			<section>
				<div className="flex gap-2 items-center text-(--primary-color)">
					<Icon icon="line-md:edit" className="w-8 h-8" />
					<span className="text-2xl">Rename</span>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="my-8">
						<input
							ref={inputRef}
							type="text"
							value={newName}
							onChange={(e) => {
								setNewName(e.target.value);
								setError(null);
							}}
							disabled={isLoading}
							className="w-full px-3 py-2 border rounded-md focus:outline-none disabled:bg-gray-100"
						/>
						{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
					</div>

					<div className="flex justify-center">
						<button
							type="submit"
							disabled={
								isLoading ||
								!newName.trim() ||
								newName.trim() === nameWithoutExt
							}
							className="block bg-(--primary-color) rounded-full m-auto py-2 px-12 cursor-pointer text-xl text-(--background-color)"
						>
							{isLoading && (
								<Icon
									icon="eos-icons:loading"
									className="w-4 h-4 animate-spin"
								/>
							)}
							OK
						</button>
					</div>
				</form>
			</section>
		</Modal>
	);
};

export default RenameModal;
